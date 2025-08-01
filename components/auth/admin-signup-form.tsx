"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { sendAdminOtp, verifyAndRegisterAdmin } from "@/lib/redux/features/authSlice";
import { AnimatePresence, motion } from "framer-motion";

type AdminRole = 'USER_MANAGER' | 'TECHNICIAN' | 'FINANCE' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';

export function AdminSignupForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        adminRole: "" as AdminRole | "",
    });
    const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
    const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    
    const dispatch = useDispatch<AppDispatch>();
    const emailOtpInputs = useRef<(HTMLInputElement | null)[]>([]);
    const mobileOtpInputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const { fullName, email, mobile, password, adminRole } = formData;
        if (!fullName || !email || !mobile || !password || !adminRole) {
            toast.error("Please fill all required fields.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Sending verification codes...");
        try {
            await dispatch(sendAdminOtp({ email, mobile })).then(unwrapResult);
            toast.success("OTP sent to email and mobile.", { id: toastId });
            setCurrentStep(2);
        } catch (error: any) {
            toast.error(error || "Failed to send OTP.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalEmailOtp = emailOtp.join("");
        const finalMobileOtp = mobileOtp.join("");

        if (finalEmailOtp.length !== 6 || finalMobileOtp.length !== 6) {
            toast.error("Please enter both 6-digit OTPs.");
            return;
        }
        
        if (!formData.adminRole) {
            toast.error("An admin role must be selected. Please go back and select a role.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Verifying and creating account...");
        
        const payload = {
            ...formData,
            adminRole: formData.adminRole,
            emailOtp: finalEmailOtp,
            mobileOtp: finalMobileOtp,
        };

        try {
            await dispatch(verifyAndRegisterAdmin(payload)).then(unwrapResult);
            toast.success("Admin account created successfully!", { id: toastId });
            setCurrentStep(1);
            setFormData({ fullName: "", email: "", mobile: "", password: "", adminRole: "" });
            setEmailOtp(new Array(6).fill(""));
            setMobileOtp(new Array(6).fill(""));
        } catch (error: any) {
            toast.error(error || "Admin creation failed.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number, type: 'email' | 'mobile') => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return;
        
        const setOtp = type === 'email' ? setEmailOtp : setMobileOtp;
        const otp = type === 'email' ? emailOtp : mobileOtp;
        const inputs = type === 'email' ? emailOtpInputs : mobileOtpInputs;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number, type: 'email' | 'mobile') => {
        const otp = type === 'email' ? emailOtp : mobileOtp;
        const inputs = type === 'email' ? emailOtpInputs : mobileOtpInputs;

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Admin Account</CardTitle>
                <CardDescription>
                    {currentStep === 1 ? "Enter details for the new privileged account." : "Enter the verification codes sent to the admin's email and mobile."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                        <motion.form key="step1" onSubmit={handleSendOtp} className="space-y-6" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                            <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" required /></div>
                            <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="admin@example.com" required /></div>
                            <div className="space-y-2"><Label htmlFor="mobile">Mobile Number</Label><Input id="mobile" type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} placeholder="9876543210" required /></div>
                            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required /></div>
                            <div className="space-y-2"><Label htmlFor="adminRole">Admin Role</Label><Select onValueChange={(value: AdminRole) => setFormData({...formData, adminRole: value})} value={formData.adminRole}><SelectTrigger><SelectValue placeholder="Select a role..." /></SelectTrigger><SelectContent><SelectItem value="USER_MANAGER">User Manager (CCE)</SelectItem><SelectItem value="TECHNICIAN">Technician</SelectItem><SelectItem value="FINANCE">Finance</SelectItem><SelectItem value="CONTENT_MANAGER">Content Manager</SelectItem><SelectItem value="SUPER_ADMIN">Super Admin</SelectItem></SelectContent></Select></div>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Sending OTP..." : "Continue to Verification"}</Button>
                        </motion.form>
                    ) : (
                        <motion.form key="step2" onSubmit={handleVerifyAndRegister} className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <div><Label>Email OTP</Label><div className="flex justify-center gap-2 mt-2">{emailOtp.map((digit, index) => (<input key={index} ref={(el) => { emailOtpInputs.current[index] = el }} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e, index, 'email')} onKeyDown={(e) => handleKeyDown(e, index, 'email')} className="w-12 h-14 text-center text-2xl font-bold bg-background border rounded-md"/>))}</div></div>
                            <div><Label>Mobile OTP</Label><div className="flex justify-center gap-2 mt-2">{mobileOtp.map((digit, index) => (<input key={index} ref={(el) => { mobileOtpInputs.current[index] = el }} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(e, index, 'mobile')} onKeyDown={(e) => handleKeyDown(e, index, 'mobile')} className="w-12 h-14 text-center text-2xl font-bold bg-background border rounded-md"/>))}</div></div>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Verifying..." : "Create Admin Account"}</Button>
                            <Button variant="ghost" className="w-full" onClick={() => setCurrentStep(1)} disabled={isLoading}>Back to Details</Button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}