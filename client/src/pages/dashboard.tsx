import { useState } from "react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { MetricCard } from "@/components/metric-card";
import { AIInsightCard } from "@/components/ai-insight-card";
import { ChartContainer } from "@/components/chart-container";
import { ShareModal } from "@/components/share-modal";
import emptyStateImg from "@assets/generated_images/Dashboard_empty_state_illustration_eb5d4745.png";

export default function Dashboard() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file.name);
    setHasData(true);
  };

  const mockChartData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

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
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your data insights and visualizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Users"
          value="24,563"
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Revenue"
          value="$128.4K"
          trend={{ value: 8.2, isPositive: true }}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.24%"
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <AIInsightCard
            title="Revenue Growth Accelerating"
            description="Monthly revenue increased by 34% over the last quarter, with strongest growth in mobile."
            confidence={92}
            onVisualize={() => console.log("Visualize insight")}
          />
          <AIInsightCard
            title="User Engagement Pattern"
            description="Peak activity occurs between 2-4 PM on weekdays. Consider scheduling campaigns accordingly."
            confidence={87}
            onVisualize={() => console.log("Visualize insight")}
          />
          <AIInsightCard
            title="Conversion Opportunity"
            description="Users from organic search have 45% higher conversion rate than paid channels."
            confidence={94}
            onVisualize={() => console.log("Visualize insight")}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ChartContainer
            title="Monthly Revenue Trend"
            data={mockChartData}
            chartType={chartType}
            onChartTypeChange={setChartType}
            onExport={() => console.log("Export chart")}
            onShare={() => setShareModalOpen(true)}
          />
          <ChartContainer
            title="User Growth"
            data={mockChartData.map((d) => ({ ...d, value: d.value * 0.8 }))}
            chartType="bar"
            onExport={() => console.log("Export chart")}
            onShare={() => setShareModalOpen(true)}
          />
        </div>
      </div>

      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
    </div>
  );
}
