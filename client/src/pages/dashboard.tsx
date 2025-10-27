import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileUploadZone } from "@/components/file-upload-zone";
import { MetricCard } from "@/components/metric-card";
import { AIInsightCard } from "@/components/ai-insight-card";
import { ChartContainer } from "@/components/chart-container";
import { ShareModal } from "@/components/share-modal";
import { DataPreviewTable } from "@/components/data-preview-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sparkles, Loader2 } from "lucide-react";
import emptyStateImg from "@assets/generated_images/Dashboard_empty_state_illustration_eb5d4745.png";
import type { Dataset, Insight } from "@shared/schema";

export default function Dashboard() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [showAllData, setShowAllData] = useState(false);
  const { toast } = useToast();

  const { data: datasets = [], isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const currentDataset = datasets[0];

  const { data: insights = [], isLoading: insightsLoading } = useQuery<Insight[]>({
    queryKey: ["/api/datasets", currentDataset?.id, "insights"],
    enabled: !!currentDataset?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
      toast({
        title: "Upload successful",
        description: "Your data has been uploaded and is ready for analysis",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      const res = await apiRequest("POST", `/api/datasets/${datasetId}/analyze`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/datasets", currentDataset?.id, "insights"] 
      });
      toast({
        title: "Analysis complete",
        description: "AI insights have been generated for your dataset",
      });
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Unable to generate AI insights. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleAnalyze = () => {
    if (currentDataset?.id) {
      analyzeMutation.mutate(currentDataset.id);
    }
  };

  const hasData = datasets.length > 0;

  // Calculate metrics from data with defensive checks
  const calculateMetrics = () => {
    if (!currentDataset?.data || !Array.isArray(currentDataset.data) || currentDataset.data.length === 0) {
      return null;
    }

    const data = currentDataset.data;
    const rowCount = data.length;
    
    // Ensure columns array exists
    if (!Array.isArray(currentDataset.columns) || currentDataset.columns.length === 0) {
      return null;
    }

    // Try to find numeric columns for metrics
    const numericColumns = currentDataset.columns.filter(col => {
      const firstVal = data[0]?.[col];
      return firstVal !== undefined && firstVal !== null && !isNaN(Number(firstVal));
    });

    return {
      rowCount,
      columnCount: currentDataset.columns.length,
      numericColumns: numericColumns.length,
    };
  };

  const metrics = calculateMetrics();

  // Generate chart data from dataset with validation
  const generateChartData = () => {
    if (!currentDataset?.data || !Array.isArray(currentDataset.data) || currentDataset.data.length === 0) {
      return [];
    }

    if (!Array.isArray(currentDataset.columns) || currentDataset.columns.length === 0) {
      return [];
    }

    const data = currentDataset.data.slice(0, 10);
    
    // Find a suitable column for labels (text/date column)
    const labelColumn = currentDataset.columns[0];
    
    // Find a numeric column for values
    const numericColumn = currentDataset.columns.find(col => {
      const firstVal = data[0]?.[col];
      return firstVal !== undefined && firstVal !== null && !isNaN(Number(firstVal));
    });

    if (!numericColumn || !labelColumn) {
      return [];
    }

    return data.map((row) => ({
      name: String(row[labelColumn] ?? "").slice(0, 10),
      value: Number(row[numericColumn]) || 0,
    }));
  };

  const chartData = generateChartData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <img
              src={emptyStateImg}
              alt="Empty state"
              className="w-64 h-48 mx-auto object-contain"
            />
            <h1 className="text-3xl font-bold">Welcome to DataLens</h1>
            <p className="text-muted-foreground text-lg">
              Upload your first dataset to unlock AI-powered insights and
              beautiful visualizations
            </p>
          </div>
          <FileUploadZone onFileSelect={handleFileSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Analysis of {currentDataset.name}
          </p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={analyzeMutation.isPending || insights.length > 0}
          data-testid="button-generate-insights"
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {insights.length > 0 ? "Insights Generated" : "Generate AI Insights"}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Rows"
          value={currentDataset.rowCount}
        />
        <MetricCard
          title="Columns"
          value={String(currentDataset.columns.length)}
        />
        <MetricCard
          title="File Size"
          value={currentDataset.fileSize}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          {insightsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                No insights yet. Click "Generate AI Insights" to analyze your data.
              </p>
            </div>
          ) : (
            insights.map((insight) => {
              const [title, ...descParts] = insight.content.split(": ");
              const description = descParts.join(": ");
              return (
                <AIInsightCard
                  key={insight.id}
                  title={title || "Insight"}
                  description={description || insight.content}
                  confidence={parseInt(insight.confidence)}
                />
              );
            })
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {chartData.length > 0 && (
            <ChartContainer
              title="Data Visualization"
              data={chartData}
              chartType={chartType}
              onChartTypeChange={setChartType}
              onExport={() => console.log("Export chart")}
              onShare={() => setShareModalOpen(true)}
            />
          )}
          <DataPreviewTable
            data={currentDataset.data as Record<string, any>[]}
            columns={currentDataset.columns}
            rowCount={parseInt(currentDataset.rowCount)}
            fileSize={currentDataset.fileSize}
            showAll={showAllData}
            onToggleShowAll={() => setShowAllData(!showAllData)}
          />
        </div>
      </div>

      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
    </div>
  );
}
