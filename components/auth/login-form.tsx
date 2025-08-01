"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import { CheckCircle, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { loginUser } from "@/lib/redux/features/authSlice";
import { toast } from "sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      x.set(mouseX - width / 2);
      y.set(mouseY - height / 2);
    }
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const toastId = toast.loading("Authenticating...");

    try {
      const resultAction = await dispatch(loginUser(formData));
      const payload = unwrapResult(resultAction);
      
      toast.success(`Welcome back, ${payload.user.fullName}!`, {
        id: toastId,
        description: "Redirecting to your dashboard...",
      });
      
      setTimeout(() => {
        if (payload.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1000);

    } catch (error: any) {
      const errorMessage = error || "Login failed due to an unknown error.";
      toast.error(errorMessage, {
        id: toastId,
        description: "Please check your details and try again.",
      });
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1, }, },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }, },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-slate-950 p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      <div className="absolute inset-0 z-0 bg-radial-gradient from-primary/5 via-transparent to-transparent dark:bg-radial-gradient dark:from-teal-900/10 dark:via-slate-950 dark:to-slate-950"></div>

      <motion.div ref={cardRef} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} variants={containerVariants} initial="hidden" animate="visible">
        <Card className="w-full max-w-5xl bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-700/80 text-gray-900 dark:text-slate-100 shadow-xl dark:shadow-2xl shadow-primary/5 dark:shadow-teal-500/10" style={{ transformStyle: "preserve-3d" }} >
          <div className="grid md:grid-cols-2 items-center" style={{ transform: "translateZ(20px)" }} >
            <motion.div className="p-8 md:p-12 hidden md:block" variants={itemVariants} >
              <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-teal-500/20 blur-xl animate-pulse"></div>
                <LogIn className="relative h-10 w-10 text-primary dark:text-teal-300" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-4">
                Authentication Core
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8">
                Welcome back to the Universal Employment & Income Empowerment Platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary dark:text-teal-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Access your personalized dashboard.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary dark:text-teal-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Manage daily tasks and assignments.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary dark:text-teal-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">
                    Track your earnings and referrals in real-time.
                  </span>
                </div>
              </div>
            </motion.div>
            <div className="p-8 md:p-12 md:border-l border-gray-200 dark:border-slate-800" style={{ transform: "translateZ(40px)" }} >
              <CardHeader className="text-center p-0 mb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  Secure Sign In
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400">
                  Enter your credentials to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
                  <motion.div className="relative group" variants={itemVariants}>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 transition-colors group-focus-within:text-primary dark:group-focus-within:text-teal-400" />
                    <Input id="email" type="email" placeholder=" " value={formData.email} onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value}))} className={`pl-10 peer bg-gray-100 dark:bg-slate-800/80 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-1 focus:ring-primary dark:focus:ring-teal-500 focus:border-primary dark:focus:border-teal-500 ${errors.email ? "border-red-500/50 focus:ring-red-500 focus:border-red-500" : ""}`} />
                    <Label htmlFor="email" className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-teal-400 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary dark:peer-[:not(:placeholder-shown)]:text-teal-400">
                      Email Address
                    </Label>
                    {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
                  </motion.div>
                  <motion.div className="relative group" variants={itemVariants}>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 transition-colors group-focus-within:text-primary dark:group-focus-within:text-teal-400" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder=" " value={formData.password} onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value}))} className={`pl-10 pr-10 peer bg-gray-100 dark:bg-slate-800/80 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-1 focus:ring-primary dark:focus:ring-teal-500 focus:border-primary dark:focus:border-teal-500 ${errors.password ? "border-red-500/50 focus:ring-red-500 focus:border-red-500" : ""}`} />
                    <Label htmlFor="password" className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-teal-400 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary dark:peer-[:not(:placeholder-shown)]:text-teal-400">
                      Password
                    </Label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors">
                      {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                    </button>
                    {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
                  </motion.div>
                  <motion.div className="text-right" variants={itemVariants}>
                    <Link href="/forgot-password" className="text-sm text-primary dark:text-teal-400 hover:underline">
                      Forgot Password?
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button type="submit" size="lg" className="w-full font-semibold bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-teal-600 dark:hover:bg-teal-700 dark:text-white shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_theme(colors.teal.500/50%)] transition-all hover:scale-105" disabled={isLoading}>
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div key="loading" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Authenticating...
                          </motion.div>
                        ) : (
                          <motion.span key="signin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            Sign In
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                  <motion.div className="text-center text-sm text-gray-500 dark:text-slate-400" variants={itemVariants}>
                    <p>
                      Don't have an account?{" "}
                      <Link href="/register" className="font-semibold text-primary dark:text-teal-400 hover:underline">
                        Initiate Onboarding
                      </Link>
                    </p>
                  </motion.div>
                </motion.form>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}