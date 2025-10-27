import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataPreviewTableProps {
  data: Record<string, any>[];
  columns: string[];
  rowCount: number;
  fileSize: string;
  showAll?: boolean;
  onToggleShowAll?: () => void;
}

export function DataPreviewTable({
  data,
  columns,
  rowCount,
  fileSize,
  showAll = false,
  onToggleShowAll,
}: DataPreviewTableProps) {
  const displayData = showAll ? data : data.slice(0, 10);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Data Preview</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="font-mono text-xs">
            {rowCount} rows
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {columns.length} columns
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {fileSize}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="w-full">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-semibold border-b"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover-elevate"
                    data-testid={`row-data-${idx}`}
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-3">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
        {!showAll && data.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleShowAll}
              data-testid="button-show-more"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Show all {rowCount} rows
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
