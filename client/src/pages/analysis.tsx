import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AIQueryBar } from "@/components/ai-query-bar";
import { DataPreviewTable } from "@/components/data-preview-table";
import { AIInsightCard } from "@/components/ai-insight-card";
import { ChartContainer } from "@/components/chart-container";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import aiAssistantImg from "@assets/generated_images/AI_assistant_visual_icon_8174b489.png";
import type { Dataset } from "@shared/schema";

export default function Analysis() {
  const [showAll, setShowAll] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    answer: string;
    confidence: number;
    suggestedVisualization?: string;
  } | null>(null);
  const { toast } = useToast();

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const currentDataset = datasets[0];

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!currentDataset?.id) {
        throw new Error("No dataset available");
      }
      const res = await apiRequest("POST", `/api/datasets/${currentDataset.id}/query`, { query });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setQueryResult(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Query failed",
        description: error.message || "Unable to process your query. Please try again.",
        variant: "destructive",
      });
    },
  });

  const mockChartData = [
    { name: "Week 1", value: 4200 },
    { name: "Week 2", value: 3800 },
    { name: "Week 3", value: 5100 },
    { name: "Week 4", value: 4700 },
  ];

  const handleQuerySubmit = (query: string) => {
    queryMutation.mutate(query);
  };

  if (!currentDataset) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            No dataset available. Please upload a dataset first.
          </p>
        </div>
      </div>
    );
  }

  const mockData = (currentDataset.data as Record<string, any>[]).slice(0, 25);

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b">
        <div className="max-w-4xl mx-auto">
          <AIQueryBar onSubmit={handleQuerySubmit} />
        </div>
      </div>

      {!queryResult && !queryMutation.isPending ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            <img
              src={aiAssistantImg}
              alt="AI Assistant"
              className="w-24 h-24 mx-auto"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Ask AI Anything</h2>
              <p className="text-muted-foreground">
                Start by asking a question about your data. Try queries like:
              </p>
            </div>
            <div className="space-y-2 text-left">
              <div className="p-3 rounded-md bg-muted/50 text-sm">
                "What are the key trends in this data?"
              </div>
              <div className="p-3 rounded-md bg-muted/50 text-sm">
                "Show me the highest values"
              </div>
              <div className="p-3 rounded-md bg-muted/50 text-sm">
                "Are there any correlations between the columns?"
              </div>
            </div>
          </div>
        </div>
      ) : queryMutation.isPending ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Analyzing your data...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-8 grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Dataset Info</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-mono">{currentDataset.rowCount} rows</p>
                  <p className="font-mono">{currentDataset.columns.length} columns</p>
                  <p className="font-mono">{currentDataset.fileSize}</p>
                </div>
              </div>
            </div>

            <div className="col-span-6 space-y-6">
              {queryResult && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">AI Answer</h3>
                        <p className="text-sm text-foreground leading-relaxed">
                          {queryResult.answer}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Confidence:</span>
                        <span className="font-mono font-medium">
                          {Math.round(queryResult.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <DataPreviewTable
                data={mockData}
                columns={currentDataset.columns}
                rowCount={parseInt(currentDataset.rowCount)}
                fileSize={currentDataset.fileSize}
                showAll={showAll}
                onToggleShowAll={() => setShowAll(!showAll)}
              />
            </div>

            <div className="col-span-3 space-y-4">
              <h3 className="font-semibold">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-muted-foreground text-xs mb-1">Columns</p>
                  <p className="font-mono font-semibold">
                    {currentDataset.columns.length}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-muted-foreground text-xs mb-1">Total Rows</p>
                  <p className="font-mono font-semibold">
                    {currentDataset.rowCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
