"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/lib/types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { updateUserDetails } from "@/lib/redux/features/admin/usersSlice";
import { toast } from "sonner";
import { UserCog, Check } from "lucide-react";

interface EditUserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserDetailsModal({ user, isOpen, onClose }: EditUserDetailsModalProps) {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    mobile: '', 
    upiName: '', 
    upiId: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullName: user.fullName || '',
        mobile: user.mobile || '',
        upiName: user.upiName || '',
        upiId: user.upiId || '',
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Saving user details...");
    try {
      await dispatch(updateUserDetails({ _id: user._id, ...formData })).unwrap();
      toast.success("User details updated successfully.", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save changes.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCog className="h-7 w-7 text-primary" />
            </div>
            <div>
                <DialogTitle className="text-xl">Edit User Details</DialogTitle>
                <DialogDescription>Changes made will be logged in the audit trail.</DialogDescription>
            </div>
        </DialogHeader>

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
        
        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-4">
                <h4 className="font-semibold text-base">Personal Information</h4>
                <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <p className="text-xs text-muted-foreground">The user's legal full name.</p>
                    <Input id="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <p className="text-xs text-muted-foreground">Used for account recovery and notifications.</p>
                    <Input id="mobile" value={formData.mobile} onChange={handleInputChange} />
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold text-base">Payment Details</h4>
                 <div className="space-y-1.5">
                    <Label htmlFor="upiName">UPI Recipient Name</Label>
                    <p className="text-xs text-muted-foreground">The name registered with the UPI ID.</p>
                    <Input id="upiName" value={formData.upiName} onChange={handleInputChange} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <p className="text-xs text-muted-foreground">e.g., yourname@bank</p>
                    <Input id="upiId" value={formData.upiId} onChange={handleInputChange} />
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}