import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareModal } from "../share-modal";

export default function ShareModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} data-testid="button-open-share">
        Open Share Modal
      </Button>
      <ShareModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
