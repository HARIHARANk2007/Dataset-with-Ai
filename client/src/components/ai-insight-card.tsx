import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIInsightCardProps {
  title: string;
  description: string;
  confidence: number;
  onVisualize?: () => void;
}

export function AIInsightCard({
  title,
  description,
  confidence,
  onVisualize,
}: AIInsightCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-base">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="h-3 w-3" />
          AI
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium font-mono">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>
        {onVisualize && (
          <Button
            size="sm"
            variant="outline"
            onClick={onVisualize}
            data-testid="button-visualize"
          >
            Visualize this
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
