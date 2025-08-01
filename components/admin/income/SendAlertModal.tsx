"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type UserIncomeProfile } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { sendContributionAlert } from "@/lib/redux/features/admin/financeSlice";
import { toast } from "sonner";
import { AlertTriangle, Send } from "lucide-react";

interface SendAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserIncomeProfile | null;
}

export function SendAlertModal({ isOpen, onClose, user }: SendAlertModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  if (!user) return null;

  const handleSend = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Sending alert to ${user.email}...`);
    try {
      await dispatch(sendContributionAlert({
          userId: user._id,
          title: "Action Required: Platform Contribution Due",
          description: "Your monthly platform contribution is now overdue. Please make the payment to avoid suspension of your video access and income features."
      })).unwrap();
      toast.success("Alert sent successfully.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to send alert.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mb-2"><AlertTriangle className="h-7 w-7 text-yellow-500" /></div>
            <DialogTitle>Send Contribution Alert</DialogTitle>
            <DialogDescription>This will send a pre-defined warning notification to the user.</DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
            <p className="text-sm">You are about to send a contribution reminder to:</p>
            <p className="font-semibold">{user.fullName} ({user.email})</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleSend} disabled={isLoading}><Send className="mr-2 h-4 w-4" />{isLoading ? 'Sending...' : 'Confirm & Send Alert'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}