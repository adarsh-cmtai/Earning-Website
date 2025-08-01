"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ManualIncomeSubmission } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { reviewSubmission } from "@/lib/redux/features/admin/incomeVerificationSlice";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface ReviewIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ManualIncomeSubmission | null;
}

export function ReviewIncomeModal({ isOpen, onClose, submission }: ReviewIncomeModalProps) {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  if (!submission) return null;

  const handleReview = async (status: 'Approved' | 'Declined') => {
    setIsLoading(true);
    const toastId = toast.loading("Submitting review...");
    try {
      await dispatch(reviewSubmission({ submissionId: submission._id, status, comment })).unwrap();
      toast.success(`Submission has been ${status.toLowerCase()}.`, { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Review Income Submission</DialogTitle><DialogDescription>Verify the details and screenshot before taking action.</DialogDescription></DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><Avatar className="h-10 w-10"><AvatarImage src={`https://avatar.vercel.sh/${submission.user.email}.png`} /><AvatarFallback>{submission.user.fullName.charAt(0)}</AvatarFallback></Avatar><div><p className="font-semibold">{submission.user.fullName}</p><p className="text-sm text-muted-foreground">{submission.user.email}</p></div></div>
                <div className="text-sm space-y-2 p-3 border rounded-lg">
                    <div className="flex justify-between"><span>Period:</span><span className="font-medium">{submission.month} {submission.year}</span></div>
                    <div className="flex justify-between"><span>Amount Claimed:</span><span className="font-bold text-lg text-primary">₹{submission.amount.toLocaleString()}</span></div>
                </div>
                <div><Label htmlFor="comment">Review Comment (Optional)</Label><Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reason for declining, if applicable..." /></div>
            </div>
            <div>
                <a href={submission.screenshotUrl} target="_blank" rel="noopener noreferrer"><img src={submission.screenshotUrl} alt="Analytics Screenshot" className="rounded-lg border aspect-video object-contain bg-muted" /></a>
                <p className="text-xs text-center text-muted-foreground mt-2">Click image to view in full screen.</p>
            </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={() => handleReview('Declined')} disabled={isLoading}><X className="mr-2 h-4 w-4" />Decline</Button>
          <Button onClick={() => handleReview('Approved')} disabled={isLoading}><Check className="mr-2 h-4 w-4" />Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}