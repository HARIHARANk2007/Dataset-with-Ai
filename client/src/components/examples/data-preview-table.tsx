import { useState } from "react";
import { DataPreviewTable } from "../data-preview-table";

export default function DataPreviewTableExample() {
  const [showAll, setShowAll] = useState(false);

  const mockData = Array.from({ length: 25 }, (_, i) => ({
    date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    users: Math.floor(Math.random() * 10000),
    revenue: `$${(Math.random() * 50000).toFixed(2)}`,
    conversions: Math.floor(Math.random() * 500),
  }));

  return (
    <div className="p-8">
      <DataPreviewTable
        data={mockData}
        columns={["date", "users", "revenue", "conversions"]}
        rowCount={mockData.length}
        fileSize="24.5 KB"
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
      />
    </div>
  );
}
