"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type User } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { resetUserPassword } from "@/lib/redux/features/admin/usersSlice";
import { toast } from "sonner";
import { useState } from "react";
import { KeyRound, AlertTriangle } from "lucide-react";

interface ResetPasswordModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ user, isOpen, onClose }: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleConfirmReset = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Resetting password for ${user.email}...`);
    try {
      await dispatch(resetUserPassword(user._id)).unwrap();
      toast.success("Password reset successfully. An email has been sent to the user.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl">Are you absolutely sure?</DialogTitle>
            <DialogDescription>This is a critical security action.</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} />
                    <AvatarFallback>{user.fullName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Action Consequences</AlertTitle>
                <AlertDescription>
                    The user's current password will be invalidated immediately. They will receive an email with instructions to set a new password.
                </AlertDescription>
            </Alert>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirmReset} disabled={isLoading}>
            <KeyRound className="mr-2 h-4 w-4" />
            {isLoading ? 'Resetting...' : 'Confirm & Reset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}