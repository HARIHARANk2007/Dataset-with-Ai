import OpenAI from "openai";

// The newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This integration uses OpenAI's API, which points to OpenAI's API servers and requires your own API key.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface DataInsight {
  title: string;
  description: string;
  confidence: number;
}

interface DataAnalysisResult {
  insights: DataInsight[];
  summary: string;
}

export async function analyzeDataset(
  data: Record<string, any>[],
  columns: string[]
): Promise<DataAnalysisResult> {
  try {
    // Sample the data if it's too large (take first 50 rows)
    const sampleData = data.slice(0, 50);

    // Calculate basic statistics
    const stats = {
      rowCount: data.length,
      columnCount: columns.length,
      columns,
      sampleData,
    };

    const prompt = `You are a data analyst assistant. Analyze the following dataset and provide insights.

Dataset Information:
- Total rows: ${stats.rowCount}
- Columns: ${stats.columns.join(", ")}
- Sample data (first few rows): ${JSON.stringify(stats.sampleData.slice(0, 5), null, 2)}

Identify:
1. Key trends or patterns in the data
2. Notable correlations between columns
3. Any anomalies or interesting observations
4. Actionable insights for a product manager

Respond with JSON in this exact format:
{
  "insights": [
    {
      "title": "Brief insight title",
      "description": "Detailed explanation of the insight",
      "confidence": 0.85
    }
  ],
  "summary": "Overall summary of the dataset"
}

Provide 3-5 insights with confidence scores between 0 and 1.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are an expert data analyst specializing in product analytics. Provide clear, actionable insights in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Validate and normalize the response
    const insights: DataInsight[] = (result.insights || []).map((insight: any) => ({
      title: String(insight.title || "Data Insight"),
      description: String(insight.description || ""),
      confidence: Math.max(0, Math.min(1, Number(insight.confidence || 0.5))),
    }));

    return {
      insights: insights.slice(0, 5), // Limit to 5 insights
      summary: String(result.summary || "Analysis complete"),
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze dataset with AI");
  }
}

export async function answerDataQuery(
  query: string,
  data: Record<string, any>[],
  columns: string[]
): Promise<{ answer: string; confidence: number; suggestedVisualization?: string }> {
  try {
    // Sample the data
    const sampleData = data.slice(0, 50);

    const prompt = `You are a data analyst assistant. Answer the user's question about this dataset.

Dataset Information:
- Total rows: ${data.length}
- Columns: ${columns.join(", ")}
- Sample data: ${JSON.stringify(sampleData.slice(0, 5), null, 2)}

User Question: ${query}

Provide a clear, concise answer based on the data. If you can suggest a visualization type (line, bar, pie, scatter), include it.

Respond with JSON in this exact format:
{
  "answer": "Your detailed answer to the question",
  "confidence": 0.85,
  "suggestedVisualization": "line" (optional: one of: line, bar, pie, scatter)
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful data analyst. Provide clear, accurate answers based on the provided data in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      answer: String(result.answer || "Unable to analyze the data for this query."),
      confidence: Math.max(0, Math.min(1, Number(result.confidence || 0.5))),
      suggestedVisualization: result.suggestedVisualization || undefined,
    };
  } catch (error) {
    console.error("OpenAI query error:", error);
    throw new Error("Failed to answer query with AI");
  }
}
