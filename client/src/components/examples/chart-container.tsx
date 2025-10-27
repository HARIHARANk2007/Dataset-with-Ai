import { useState } from "react";
import { ChartContainer } from "../chart-container";

export default function ChartContainerExample() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");

  const mockData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  return (
    <div className="p-8">
      <ChartContainer
        title="Monthly Revenue"
        data={mockData}
        chartType={chartType}
        onChartTypeChange={setChartType}
        onExport={() => console.log("Export chart")}
        onShare={() => console.log("Share chart")}
      />
    </div>
  );
}
