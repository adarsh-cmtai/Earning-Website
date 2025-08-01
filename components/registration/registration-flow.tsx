"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ReferralStep } from "./steps/referral-step";
import { RegistrationFormStep } from "./steps/registration-form-step";
import { OTPVerificationStep } from "./steps/otp-verification-step";
import { TermsStep } from "./steps/terms-step";
import { TopicSelectionStep } from "./steps/topic-selection-step";
import { ChannelNameStep } from "./steps/channel-name-step";
import { GuidanceStep } from "./steps/guidance-step";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Referral" },
  { id: 2, title: "Details" },
  { id: 3, title: "Verification" },
  { id: 4, title: "Terms" },
  { id: 5, title: "Topic" },
  { id: 6, title: "Channel" },
  { id: 7, title: "Setup" },
];

const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
};

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    referralId: "",
    fullName: "",
    email: "",
    mobile: "",
    upiName: "",
    upiId: "",
    password: "",
    selectedTopic: "",
    channelName: "",
  });
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = useCallback(
    (data: Partial<typeof formData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    []
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ReferralStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 2:
        return <RegistrationFormStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <OTPVerificationStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <TermsStep formData={formData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <TopicSelectionStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <ChannelNameStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <GuidanceStep onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
            UEIEP Onboarding Protocol
        </h1>
        <p className="text-muted-foreground">Complete your setup in {steps.length} secure steps.</p>
      </div>
      <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border shadow-xl dark:shadow-2xl shadow-primary/5 dark:shadow-teal-500/10">
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;
                return (
                  <div key={step.id} className="flex items-center w-full">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                          isActive 
                            ? "bg-primary/10 dark:bg-teal-500/20 border-primary dark:border-teal-500 text-primary dark:text-teal-300 ring-4 ring-primary/10 dark:ring-teal-500/10" 
                            : isCompleted 
                            ? "bg-primary dark:bg-teal-500 border-primary dark:border-teal-500 text-white" 
                            : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? "✓" : step.id}
                      </div>
                      <div className={`mt-2 text-xs text-center font-semibold whitespace-nowrap hidden sm:block ${
                          isActive 
                            ? "text-primary dark:text-teal-400" 
                            : isCompleted 
                            ? "text-foreground" 
                            : "text-muted-foreground"
                        }`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-auto h-px bg-border mx-2 sm:mx-4">
                        <div className="h-full bg-primary dark:bg-teal-500 transition-all duration-500" style={{ width: isCompleted ? '100%' : isActive ? '50%' : '0%' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="min-h-[24rem] flex flex-col justify-center border-t pt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}