"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type UserIncomeProfile } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { setContributionPercentage } from "@/lib/redux/features/admin/financeSlice";
import { toast } from "sonner";
import { Percent } from "lucide-react";

interface SetContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserIncomeProfile | null;
}

export function SetContributionModal({ isOpen, onClose, user }: SetContributionModalProps) {
  const [percentage, setPercentage] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      setPercentage(user.suggestedContributionPercentage || 10);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    if (Number(percentage) < 0 || Number(percentage) > 100) {
      toast.error("Please enter a percentage between 0 and 100.");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Updating contribution percentage...");
    try {
      await dispatch(setContributionPercentage({ userId: user._id, percentage: Number(percentage) })).unwrap();
      toast.success("Percentage updated successfully.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update percentage.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Set Suggested Contribution</DialogTitle><DialogDescription>Set the recommended monthly contribution percentage for {user.fullName}.</DialogDescription></DialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="percentage">Contribution Percentage (%)</Label>
            <div className="relative"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="percentage" type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} className="pl-9" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button><Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Percentage'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}