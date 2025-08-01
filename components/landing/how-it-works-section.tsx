"use client";

import { motion, Variants } from "framer-motion";
import { UserPlus, Banknote, Bot, UploadCloud } from "lucide-react";

const processSteps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description:
      "Quickly sign up with a referral link and complete your profile to unlock your dashboard.",
  },
  {
    icon: Bot,
    title: "Generate AI Content",
    description:
      "Each user will receive personalized content based on their selected topic and channel name. The content will be made available in your dashboard, and users can download it only after completing their daily upload assignments.",
  },
  {
    icon: UploadCloud,
    title: "Complete Tasks",
    description:
      "Upload the content and complete simple daily assignments to start your earning journey.",
  },
  {
    icon: Banknote,
    title: "Earn & Withdraw",
    description:
      "Watch your income grow and withdraw your earnings instantly and securely via UPI.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: "circOut",
    },
  },
};

export function HowItWorksSection() {
  return (
    <section className="py-10 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Your Blueprint to Digital Success
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            We've engineered a straightforward path to financial empowerment.
            Follow the blueprint to build your future.
          </p>
        </div>

        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              // <<< CHANGED: Added h-full to ensure the flex container fills the grid cell
              className="relative flex flex-col items-center h-full"
              variants={itemVariants}
            >
              {/* --- Icon Part (Fixed Height) --- */}
              <div className="relative z-10 w-full text-center">
                <div className="flex justify-center items-center mb-6">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-teal-500/10 blur-xl"></div>
                    <div className="relative text-2xl font-bold text-primary dark:text-teal-400">
                      0{index + 1}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600">
                      <step.icon className="h-5 w-5 text-primary dark:text-teal-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-slate-700 flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 text-center">
                  {step.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-slate-400 text-sm text-center">
                  {step.description}
                </p>
              </div>

              {index < processSteps.length - 1 && (
                <div className="absolute top-10 left-1/2 w-full h-0.5 hidden lg:block">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500/50 to-sky-500/50"
                    variants={lineVariants}
                    style={{ originX: 0 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
