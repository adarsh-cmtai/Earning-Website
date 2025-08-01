"use client"

import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import { UserPlus, Users, ArrowRight, CheckCircle, FileCheck, Fingerprint } from "lucide-react"
import { useEffect } from "react"

interface ReferralStepProps {
  formData: {
    referralId: string
  }
  updateFormData: (data: { referralId: string }) => void
  onNext: () => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const nextSteps = [
    { icon: UserPlus, text: "Enter your personal details" },
    { icon: Fingerprint, text: "Verify your contact info" },
    { icon: FileCheck, text: "Accept our terms to begin" },
]

export function ReferralStep({ formData, updateFormData, onNext }: ReferralStepProps) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const referralId = urlParams.get("ref") || "UEIEP-DEFAULT-REF"
    updateFormData({ referralId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.div variants={itemVariants} className="relative inline-flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-teal-500/20 blur-xl"></div>
            <Users className="relative h-10 w-10 text-primary dark:text-teal-300" />
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 dark:text-slate-100">Welcome to the Network!</motion.h2>
        <motion.p variants={itemVariants} className="mt-2 text-gray-600 dark:text-slate-400">You've been invited to join our platform.</motion.p>
        
        <motion.div variants={itemVariants} className="mt-8">
            <div className="p-4 bg-primary/10 dark:bg-teal-900/50 border border-primary/20 dark:border-teal-500/30 rounded-lg inline-flex items-center gap-3">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
                >
                    <CheckCircle className="h-6 w-6 text-primary dark:text-teal-400" />
                </motion.div>
                <p className="text-gray-800 dark:text-slate-200">
                    Referred by: <span className="font-bold text-gray-900 dark:text-white">{formData.referralId}</span>
                </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">This ID has been applied automatically and cannot be changed.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 p-6 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/80 rounded-xl">
            <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-4">Your Next Steps</h3>
            <div className="space-y-3 text-left">
                {nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-200/70 dark:bg-slate-700/50 rounded-md">
                        <step.icon className="h-5 w-5 text-primary dark:text-teal-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-slate-300">{step.text}</span>
                    </div>
                ))}
            </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
            <Button 
                onClick={onNext} 
                size="lg" 
                className="w-full sm:w-auto font-semibold bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-teal-600 dark:hover:bg-teal-700 dark:text-white shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_theme(colors.teal.500/50%)] transition-all hover:scale-105"
            >
                Continue Onboarding
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </motion.div>
    </motion.div>
  )
}