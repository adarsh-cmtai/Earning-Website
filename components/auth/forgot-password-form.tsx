"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { forgotPassword, resetPassword } from "@/lib/redux/features/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading("Sending reset code...");
        try {
            await dispatch(forgotPassword(email)).unwrap();
            toast.success("Reset code sent to your email.", { id: toastId });
            setStep(2);
        } catch (error: any) {
            toast.error(error, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading("Resetting your password...");
        try {
            await dispatch(resetPassword({ email, otp, newPassword })).unwrap();
            toast.success("Password reset successfully!", {
                id: toastId,
                description: "You can now log in with your new password.",
            });
            router.push("/login");
        } catch (error: any) {
            toast.error(error, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4"><KeyRound className="h-6 w-6 text-primary" /></div>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                    {step === 1 ? "Enter your email to receive a password reset code." : "Enter the code and your new password."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form key="step1" onSubmit={handleSendOtp} className="space-y-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                            <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Reset Code'}</Button>
                        </motion.form>
                    ) : (
                        <motion.form key="step2" onSubmit={handleResetPassword} className="space-y-4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <div><Label htmlFor="otp">Reset Code (OTP)</Label><Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required /></div>
                            <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Resetting...' : 'Reset Password'}</Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}