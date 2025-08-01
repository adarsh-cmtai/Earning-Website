"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { createContributionOrder, verifyContributionPayment } from "@/lib/redux/features/user/incomeSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreditCard, Zap, Percent } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ContributionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export function ContributionPaymentModal({ isOpen, onClose, currentBalance }: ContributionPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState<number | string>("");
  const dispatch = useDispatch<AppDispatch>();

  const calculatedAmount = currentBalance * (Number(percentage) / 100);

  const handlePayment = async () => {
    if (Number(percentage) <= 0 || Number(percentage) > 100) {
      toast.error("Please enter a valid percentage between 1 and 100.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Initiating secure payment...");

    try {
        const order = await dispatch(createContributionOrder(Number(percentage))).unwrap();
        
        toast.loading("Simulating payment completion...", { id: toastId });
        
        setTimeout(async () => {
            try {
                await dispatch(verifyContributionPayment({
                    orderId: order.orderId,
                    paymentId: `mock_pay_${Date.now()}`,
                    signature: "mock_signature",
                    percentage: order.percentage
                })).unwrap();

                toast.success("Payment successful! Your contribution has been recorded.", { id: toastId });
                onClose();
            } catch (verifyError: any) {
                toast.error(verifyError || "Payment verification failed.", { id: toastId });
            } finally {
                setIsLoading(false);
            }
        }, 2000);

    } catch (orderError: any) {
        toast.error(orderError || "Could not create payment order.", { id: toastId });
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2"><CreditCard className="h-7 w-7 text-primary" /></div>
            <DialogTitle className="text-xl">Platform Contribution</DialogTitle><DialogDescription>Settle your platform dues to continue enjoying all features.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground text-center">Your Current Balance</p>
                <p className="text-3xl font-bold tracking-tight text-center">₹{currentBalance.toLocaleString()}</p>
            </div>
            <div>
              <Label htmlFor="percentage">Enter Contribution Percentage (%)</Label>
              <div className="relative mt-1"><Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="percentage" type="number" placeholder="e.g., 10" value={percentage} onChange={(e) => setPercentage(e.target.value)} className="pl-9" /></div>
            </div>
            {Number(percentage) > 0 && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Calculated Amount to Pay</p>
                    <p className="text-2xl font-bold text-primary">₹{calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            )}
            <Alert><Zap className="h-4 w-4" /><AlertTitle>Simulation Notice</AlertTitle><AlertDescription>This is a simulated payment flow. No real money will be deducted.</AlertDescription></Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handlePayment} disabled={isLoading || calculatedAmount <= 0}>
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}