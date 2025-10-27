import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <Card
      className={`max-w-2xl mx-auto p-12 border-2 border-dashed transition-colors hover-elevate ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="card-file-upload"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          <Upload className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Your Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              CSV
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              JSON
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              Excel
            </Badge>
          </div>
        </div>
        <input
          type="file"
          accept=".csv,.json,.xlsx"
          className="hidden"
          id="file-input"
          onChange={handleFileInput}
          data-testid="input-file"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer text-sm font-medium text-primary hover:underline"
        >
          Choose File
        </label>
      </div>
    </Card>
  );
}
