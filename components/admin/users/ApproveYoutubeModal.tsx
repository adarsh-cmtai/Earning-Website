"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type User } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { approveYoutube } from "@/lib/redux/features/admin/usersSlice";
import { toast } from "sonner";
import { useState } from "react";
import { Youtube, Check, X, User as UserIcon, Mail, Link as LinkIcon } from "lucide-react";

interface ApproveYoutubeModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ApproveYoutubeModal({ user, isOpen, onClose }: ApproveYoutubeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateStatus = async (status: 'Verified' | 'Declined') => {
    setIsLoading(true);
    const toastId = toast.loading(`Updating channel status to ${status}...`);
    try {
      await dispatch(approveYoutube({ userId: user._id, status })).unwrap();
      toast.success("Channel status updated successfully.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
        case "Verified": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Verified</Badge>;
        case "Declined": return <Badge variant="destructive">Declined</Badge>;
        default: return <Badge variant="secondary">Pending Review</Badge>;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <Youtube className="h-7 w-7 text-red-500" />
            </div>
            <div>
                <DialogTitle className="text-xl">Review Social Media Channel</DialogTitle>
                <DialogDescription>Approve or decline the channel linked by the user.</DialogDescription>
            </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div className="space-y-3">
                <h4 className="font-semibold">User Details</h4>
                <div className="text-sm space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2"><UserIcon className="h-4 w-4" /> <span>{user.fullName || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <span>{user.email}</span></div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold">Channel Information</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Status:</span>
                        {getStatusBadge(user.youtubeStatus)}
                    </div>
                    <Card className="bg-muted/50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <span className="font-medium text-sm text-muted-foreground">Channel link not available in data</span>
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        
        <DialogFooter className="grid grid-cols-2 gap-4 sm:flex">
            <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => handleUpdateStatus('Declined')} 
                disabled={isLoading}
            >
                <X className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Decline'}
            </Button>
            <Button 
                className="w-full"
                onClick={() => handleUpdateStatus('Verified')} 
                disabled={isLoading}
            >
                <Check className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Approve'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}