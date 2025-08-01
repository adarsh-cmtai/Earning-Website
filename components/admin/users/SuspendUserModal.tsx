"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { type User } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { suspendUser } from "@/lib/redux/features/admin/usersSlice";
import { toast } from "sonner";
import { ShieldX, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SuspendUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function SuspendUserModal({ user, isOpen, onClose }: SuspendUserModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isSuspended = user.status === "Suspended";

  const handleUpdateStatus = async () => {
    if (!isSuspended && !reason.trim()) {
      toast.error("A reason is required to suspend a user.");
      return;
    }

    setIsLoading(true);
    const action = isSuspended ? 'Activating' : 'Suspending';
    const toastId = toast.loading(`${action} user account...`);

    try {
      await dispatch(suspendUser({ 
        userId: user._id, 
        reason: isSuspended ? 'Account reactivated by admin.' : reason, 
        suspend: !isSuspended 
      })).unwrap();

      toast.success(`User account successfully ${isSuspended ? 'activated' : 'suspended'}.`, { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action.toLowerCase()} user.`, { id: toastId });
    } finally {
        setIsLoading(false);
        setReason('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className={cn(
                "w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center",
                isSuspended ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50"
            )}>
                {isSuspended ? <ShieldCheck className="h-7 w-7 text-green-500" /> : <ShieldX className="h-7 w-7 text-red-500" />}
            </div>
            <div>
                <DialogTitle className="text-xl">{isSuspended ? 'Activate User' : 'Suspend User'}</DialogTitle>
                <DialogDescription>Confirm the action for the user below.</DialogDescription>
            </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} />
                    <AvatarFallback>{user.fullName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Account Status:</span>
                    <Badge variant={isSuspended ? "destructive" : "default"} className={isSuspended ? "" : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"}>
                        {user.status}
                    </Badge>
                </div>
                
                <AnimatePresence>
                {!isSuspended && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Suspension</Label>
                            <Textarea 
                                id="reason" 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                                placeholder="e.g., Violation of terms of service..."
                                className="min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground">This reason is required and will be logged for auditing purposes.</p>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            className={cn(isSuspended ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700" : "")}
            variant={isSuspended ? "default" : "destructive"} 
            onClick={handleUpdateStatus} 
            disabled={isLoading || (!isSuspended && !reason.trim())}
          >
            {isSuspended ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldX className="mr-2 h-4 w-4" />}
            {isLoading ? 'Processing...' : (isSuspended ? 'Confirm Activation' : 'Confirm Suspension')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}