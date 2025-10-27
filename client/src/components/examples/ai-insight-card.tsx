import { AIInsightCard } from "../ai-insight-card";

export default function AIInsightCardExample() {
  return (
    <div className="p-8 max-w-md">
      <AIInsightCard
        title="Revenue Growth Accelerating"
        description="Your monthly revenue has increased by 34% over the last quarter, with the strongest growth in the mobile segment."
        confidence={92}
        onVisualize={() => console.log("Visualize clicked")}
      />
    </div>
  );
}
