import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirmClick = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      // Error is likely handled by parent via toast, but we ensure loading is stopped
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading && !open) onClose(); }}>
      <DialogContent 
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => { if (isLoading) e.preventDefault(); }}
        onInteractOutside={(e) => { if (isLoading) e.preventDefault(); }}
      >
        <DialogHeader className="items-center text-center space-y-4">
          <div className="rounded-full border border-destructive/20 bg-destructive/10 p-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this? This action cannot be undone and will permanently remove{" "}
              <span className="font-semibold text-foreground">{itemName}</span>.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-center gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading} 
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirmClick} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}