import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { processBulkPayout } from "@/lib/redux/features/admin/financeSlice";
import { toast } from "sonner";

interface BulkPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: string[];
  totalAmount: number;
}

export function BulkPayoutModal({ isOpen, onClose, selectedUsers, totalAmount }: BulkPayoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleProcessPayouts = async () => {
    if (selectedUsers.length === 0) {
        toast.error("No users selected for payout.");
        return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Processing bulk payout...");
    
    try {
        await dispatch(processBulkPayout({ userIds: selectedUsers, totalAmount })).unwrap();
        toast.success("Bulk payout processed successfully!", { 
            id: toastId,
            description: `Payouts for ${selectedUsers.length} users have been marked as complete.`
        });
        onClose();
    } catch (error: any) {
        toast.error(error || "Payout processing failed.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Bulk Payout</DialogTitle>
          <DialogDescription>
            You are about to process payouts for{" "}
            <span className="font-bold">{selectedUsers.length} selected users</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground">Total Payout Amount</p>
          <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleProcessPayouts} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Confirm & Process'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}