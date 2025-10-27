import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIQueryBarProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
}

export function AIQueryBar({
  onSubmit,
  placeholder = "Ask anything about your data...",
}: AIQueryBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-12 pl-12 pr-4 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="input-ai-query"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12"
          data-testid="button-submit-query"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
