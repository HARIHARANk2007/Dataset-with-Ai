import { useState } from "react";
import { AIQueryBar } from "@/components/ai-query-bar";
import { DataPreviewTable } from "@/components/data-preview-table";
import { AIInsightCard } from "@/components/ai-insight-card";
import { ChartContainer } from "@/components/chart-container";
import aiAssistantImg from "@assets/generated_images/AI_assistant_visual_icon_8174b489.png";

export default function Analysis() {
  const [showAll, setShowAll] = useState(false);
  const [hasQuery, setHasQuery] = useState(false);

  const mockData = Array.from({ length: 25 }, (_, i) => ({
    date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    users: Math.floor(Math.random() * 10000),
    revenue: `$${(Math.random() * 50000).toFixed(2)}`,
    conversions: Math.floor(Math.random() * 500),
  }));

  const mockChartData = [
    { name: "Week 1", value: 4200 },
    { name: "Week 2", value: 3800 },
    { name: "Week 3", value: 5100 },
    { name: "Week 4", value: 4700 },
  ];

  const handleQuerySubmit = (query: string) => {
    console.log("AI Query:", query);
    setHasQuery(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b">
        <div className="max-w-4xl mx-auto">
          <AIQueryBar onSubmit={handleQuerySubmit} />
        </div>
      </div>

      {!hasQuery ? (
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
                "What are the top revenue-generating products?"
              </div>
              <div className="p-3 rounded-md bg-muted/50 text-sm">
                "Show me user growth trends over time"
              </div>
              <div className="p-3 rounded-md bg-muted/50 text-sm">
                "Find correlations between marketing spend and conversions"
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-8 grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Data Preview</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-mono">25 rows</p>
                  <p className="font-mono">4 columns</p>
                  <p className="font-mono">24.5 KB</p>
                </div>
              </div>
            </div>

            <div className="col-span-6 space-y-6">
              <ChartContainer
                title="Query Results"
                data={mockChartData}
                chartType="line"
                onExport={() => console.log("Export")}
                onShare={() => console.log("Share")}
              />
              <DataPreviewTable
                data={mockData}
                columns={["date", "users", "revenue", "conversions"]}
                rowCount={mockData.length}
                fileSize="24.5 KB"
                showAll={showAll}
                onToggleShowAll={() => setShowAll(!showAll)}
              />
            </div>

            <div className="col-span-3 space-y-4">
              <h3 className="font-semibold">AI Insights</h3>
              <AIInsightCard
                title="Strong Growth Signal"
                description="User acquisition is up 28% this month compared to last month."
                confidence={91}
              />
              <AIInsightCard
                title="Revenue Correlation"
                description="Revenue shows strong positive correlation with user count (r=0.89)."
                confidence={88}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
