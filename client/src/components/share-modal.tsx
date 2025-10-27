import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl?: string;
}

export function ShareModal({
  open,
  onOpenChange,
  shareUrl = "https://datalens.app/share/abc123",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [requirePassword, setRequirePassword] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-share">
        <DialogHeader>
          <DialogTitle>Share Dashboard</DialogTitle>
          <DialogDescription>
            Create a shareable link for this analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">Public Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
                data-testid="input-share-url"
              />
              <Button
                size="icon"
                onClick={handleCopy}
                data-testid="button-copy-url"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-downloads">Allow downloads</Label>
                <p className="text-xs text-muted-foreground">
                  Let viewers export data and charts
                </p>
              </div>
              <Switch
                id="allow-downloads"
                checked={allowDownloads}
                onCheckedChange={setAllowDownloads}
                data-testid="switch-allow-downloads"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-password">Password protection</Label>
                <p className="text-xs text-muted-foreground">
                  Require a password to view
                </p>
              </div>
              <Switch
                id="require-password"
                checked={requirePassword}
                onCheckedChange={setRequirePassword}
                data-testid="switch-require-password"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
