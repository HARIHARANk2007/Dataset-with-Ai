import { useState, useEffect } from "react";
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
import { Copy, Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetId?: string;
}

export function ShareModal({
  open,
  onOpenChange,
  datasetId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setShareUrl("");
      setAllowDownloads(true);
      setRequirePassword(false);
      setPassword("");
      setCopied(false);
    }
  }, [open]);

  const createShareMutation = useMutation({
    mutationFn: async () => {
      if (!datasetId) {
        throw new Error("No dataset selected");
      }
      if (requirePassword && !password) {
        throw new Error("Password is required when password protection is enabled");
      }
      const res = await apiRequest("POST", "/api/shares", {
        datasetId,
        allowDownloads,
        requirePassword,
        password: requirePassword ? password : null,
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setShareUrl(data.shareUrl);
      toast({
        title: "Share link created",
        description: "Your shareable link is ready",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create share link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateLink = () => {
    createShareMutation.mutate();
  };

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          {!shareUrl ? (
            <>
              <div className="space-y-4">
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
                {requirePassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      data-testid="input-password"
                    />
                  </div>
                )}
              </div>
              <Button
                onClick={handleCreateLink}
                disabled={createShareMutation.isPending || (requirePassword && !password)}
                className="w-full"
                data-testid="button-create-share"
              >
                {createShareMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating link...
                  </>
                ) : (
                  "Create Share Link"
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-url">Share Link</Label>
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
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Downloads: {allowDownloads ? "Allowed" : "Disabled"}</p>
                <p>Password: {requirePassword ? "Required" : "Not required"}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
