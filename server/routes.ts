import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import Papa from "papaparse";
import { insertDatasetSchema } from "@shared/schema";
import { analyzeDataset, answerDataQuery } from "./openai";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and parse dataset
  app.post("/api/datasets/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString("utf-8");
      let parsedData: any[] = [];
      let columns: string[] = [];

      // Parse CSV or JSON
      if (req.file.mimetype === "text/csv" || req.file.originalname.endsWith(".csv")) {
        const result = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
        });

        // Check for parsing errors
        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map(e => e.message).join(", ");
          return res.status(400).json({ error: `CSV parsing failed: ${errorMessages}` });
        }

        parsedData = result.data;
        columns = result.meta.fields || [];

        // Validate that we have data and columns
        if (!columns.length || !parsedData.length) {
          return res.status(400).json({ error: "CSV file is empty or has no valid headers" });
        }

        // Validate each row is a proper object with at least one defined value
        parsedData = parsedData.filter((row) => {
          if (typeof row !== "object" || row === null) return false;
          // Check if at least one column has a defined, non-empty value
          return columns.some(col => {
            const val = row[col];
            return val !== undefined && val !== null && val !== "";
          });
        });

        if (parsedData.length === 0) {
          return res.status(400).json({ error: "CSV contains no valid data rows" });
        }
      } else if (req.file.mimetype === "application/json" || req.file.originalname.endsWith(".json")) {
        const jsonContent = JSON.parse(fileContent);
        
        // Ensure JSON is an array
        if (!Array.isArray(jsonContent)) {
          return res.status(400).json({ error: "JSON must be an array of objects" });
        }

        parsedData = jsonContent;

        // Validate array is not empty and contains objects
        if (parsedData.length === 0) {
          return res.status(400).json({ error: "JSON array is empty" });
        }

        // Validate each element is a non-null object with at least one defined value
        const invalidRows = parsedData.filter((row) => {
          if (typeof row !== "object" || row === null || Array.isArray(row)) {
            return true;
          }
          // Check if at least one property has a defined, non-empty value
          const values = Object.values(row);
          return !values.some(val => val !== undefined && val !== null && val !== "");
        });

        if (invalidRows.length > 0) {
          return res.status(400).json({ 
            error: "JSON array must contain only objects with at least one defined value" 
          });
        }

        // Extract columns from first object
        columns = Object.keys(parsedData[0]);
        
        if (columns.length === 0) {
          return res.status(400).json({ error: "JSON objects have no properties" });
        }
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload CSV or JSON." });
      }

      // Validate the dataset payload
      const datasetPayload = {
        name: req.file.originalname,
        data: parsedData,
        columns,
        rowCount: String(parsedData.length),
        fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
      };

      // Validate with schema
      const validatedPayload = insertDatasetSchema.parse(datasetPayload);

      // Create dataset
      const dataset = await storage.createDataset(validatedPayload);

      res.json(dataset);
    } catch (error) {
      console.error("File upload error:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid dataset format" });
      }
      if (error instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  // Get all datasets
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error) {
      console.error("Get datasets error:", error);
      res.status(500).json({ error: "Failed to fetch datasets" });
    }
  });

  // Get single dataset
  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const dataset = await storage.getDataset(req.params.id);
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      res.json(dataset);
    } catch (error) {
      console.error("Get dataset error:", error);
      res.status(500).json({ error: "Failed to fetch dataset" });
    }
  });

  // Delete dataset
  app.delete("/api/datasets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDataset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Delete dataset error:", error);
      res.status(500).json({ error: "Failed to delete dataset" });
    }
  });

  // Get insights for a dataset
  app.get("/api/datasets/:id/insights", async (req, res) => {
    try {
      const insights = await storage.getInsightsByDataset(req.params.id);
      res.json(insights);
    } catch (error) {
      console.error("Get insights error:", error);
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  // Generate AI insights for a dataset
  app.post("/api/datasets/:id/analyze", async (req, res) => {
    try {
      const dataset = await storage.getDataset(req.params.id);
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }

      // Generate AI insights
      const analysis = await analyzeDataset(
        dataset.data as Record<string, any>[],
        dataset.columns
      );

      // Store insights
      const storedInsights = await Promise.all(
        analysis.insights.map((insight) =>
          storage.createInsight({
            datasetId: dataset.id,
            content: `${insight.title}: ${insight.description}`,
            confidence: String(Math.round(insight.confidence * 100)),
          })
        )
      );

      res.json({
        insights: storedInsights,
        summary: analysis.summary,
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  // Answer a natural language query about a dataset
  app.post("/api/datasets/:id/query", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const dataset = await storage.getDataset(req.params.id);
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }

      const result = await answerDataQuery(
        query,
        dataset.data as Record<string, any>[],
        dataset.columns
      );

      res.json(result);
    } catch (error) {
      console.error("Query answer error:", error);
      res.status(500).json({ error: "Failed to answer query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
