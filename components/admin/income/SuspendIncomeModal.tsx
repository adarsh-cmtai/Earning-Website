import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { type UserIncomeProfile } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { updateIncomeStatus } from "@/lib/redux/features/admin/financeSlice";
import { toast } from "sonner";

interface SuspendIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserIncomeProfile | null;
}

export function SuspendIncomeModal({
  isOpen,
  onClose,
  user,
}: SuspendIncomeModalProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!user) return null;

  const isSuspended = user.incomeStatus === "Suspended";
  const newStatus = isSuspended ? "Active" : "Suspended";

  const handleUpdateStatus = async () => {
    if (!isSuspended && !reason.trim()) {
      toast.error("Please provide a reason for suspension.");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading(`Updating income status to ${newStatus}...`);
    
    try {
      await dispatch(updateIncomeStatus({
        userId: user._id,
        status: newStatus,
        reason: isSuspended ? "Income reactivated by admin" : reason,
      })).unwrap();

      toast.success("Income status updated successfully.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to update status.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSuspended ? "Reactivate" : "Suspend"} User's Income
          </DialogTitle>
          <DialogDescription>
            This will affect income calculation and video access for{" "}
            {user.email}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p>
            Current Income Status:{" "}
            <span
              className={`font-bold ${isSuspended ? "text-red-500" : "text-green-500"}`}
            >
              {user.incomeStatus}
            </span>
          </p>
          {!isSuspended && (
            <div>
              <Label htmlFor="reason">
                Reason for Suspension (Required & Logged)
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Failure to meet monthly contribution requirement."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isSuspended ? "default" : "destructive"}
            onClick={handleUpdateStatus}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : (isSuspended ? 'Confirm Reactivation' : 'Confirm Suspension')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}