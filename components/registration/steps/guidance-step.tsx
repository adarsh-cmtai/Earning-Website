"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { getCurrentUser } from "@/lib/redux/features/authSlice";
import { useEffect } from "react";
import { ArrowLeft, Phone, Video, Check, Clock, Rocket, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function GuidanceStep({ onNext, onBack }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const isVerified = user?.youtubeStatus === 'Verified';

  useEffect(() => {
    if (!isVerified) {
      const interval = setInterval(() => {
        dispatch(getCurrentUser());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dispatch, isVerified]);

  const StatusDisplay = () => {
    const statusKey = user?.youtubeStatus || 'Pending';
    
    const statusVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" as const } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" as const } },
    };

    return (
        <AnimatePresence mode="wait">
        {statusKey === 'Verified' && (
            <motion.div key="verified" variants={statusVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Channel Approved!</h3>
                <p className="text-muted-foreground">Congratulations! You're all set to begin your journey.</p>
            </motion.div>
        )}
        {statusKey === 'Pending' && (
            <motion.div key="pending" variants={statusVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 rounded-full bg-yellow-500/10 animate-ping"></div>
                    <div className="relative w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                        <Clock className="h-10 w-10 text-yellow-500" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">Pending Review</h3>
                <p className="text-muted-foreground">Our team is reviewing your channel. This page will update automatically upon approval.</p>
            </motion.div>
        )}
        {statusKey === 'Declined' && (
            <motion.div key="declined" variants={statusVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <X className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-500">Action Required</h3>
                <p className="text-muted-foreground">Your channel submission was not approved. Please contact our support team for further assistance.</p>
            </motion.div>
        )}
        </AnimatePresence>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center p-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome Aboard!</h2>
            <p className="mt-3 text-lg text-muted-foreground">Just a few final steps before you launch into the dashboard.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className={cn("transition-opacity", isVerified && "opacity-50")}>
                <CardHeader className="flex-row items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">1</div>
                    <div><CardTitle>Onboarding Checklist</CardTitle><CardDescription>Get familiar with the platform.</CardDescription></div>
                </CardHeader>
                <CardContent className="divide-y">
                    <Link href="#" target="_blank" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-t-md"><div className="flex items-center gap-3"><Video className="h-5 w-5 text-muted-foreground"/><span>How to Create Your YouTube Channel</span></div><ArrowRight className="h-4 w-4 text-muted-foreground"/></Link>
                    <Link href="#" target="_blank" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"><div className="flex items-center gap-3"><Video className="h-5 w-5 text-muted-foreground"/><span>Linking Your Channel to UEIEP</span></div><ArrowRight className="h-4 w-4 text-muted-foreground"/></Link>
                    <Link href="#" target="_blank" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-b-md"><div className="flex items-center gap-3"><Video className="h-5 w-5 text-muted-foreground"/><span>Platform Overview & Best Practices</span></div><ArrowRight className="h-4 w-4 text-muted-foreground"/></Link>
                </CardContent>
            </Card>

            <Card className={cn("transition-opacity", isVerified && "opacity-50")}>
                <CardHeader className="flex-row items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">2</div>
                    <div><CardTitle>Need Help?</CardTitle><CardDescription>Contact our support team if you're stuck.</CardDescription></div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="tel:+910000000000"><Button size="lg" variant="outline" className="w-full h-16 text-base"><Phone className="mr-3 h-5 w-5"/>Call for Guidance</Button></a>
                    <Link href="#"><Button size="lg" variant="outline" className="w-full h-16 text-base"><Video className="mr-3 h-5 w-5"/>Schedule Live Call</Button></Link>
                </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader><CardTitle>Approval Status</CardTitle></CardHeader>
                <CardContent>
                    <StatusDisplay />
                </CardContent>
            </Card>
          </aside>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto h-12 text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Button>
          <Button 
              onClick={onNext} 
              // disabled={!isVerified} 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
              size="lg"
          >
              <Rocket className="mr-2 h-5 w-5" />
              Proceed to Dashboard Or Login
          </Button>
      </div>
    </div>
  );
}