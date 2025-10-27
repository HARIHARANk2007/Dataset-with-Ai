import { MetricCard } from "../metric-card";

export default function MetricCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
}
