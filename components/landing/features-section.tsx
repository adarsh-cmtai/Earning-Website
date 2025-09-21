"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  Variants,
} from "framer-motion";
import { Users, DollarSign, Shield, TrendingUp, Video } from "lucide-react";
import React from "react";

const featuresList = [
  {
    icon: Video,
    title: "AI-Powered Content Creation",
    description:
      "Receive personalized, AI-generated video scripts on trending topics, with optimized titles and tags to maximize your Social Media channel's reach and engagement effortlessly.",
  },
  {
    icon: DollarSign,
    title: "Multiple Income Streams",
    description:
      "Our platform offers social media monetization and a transparent multi-level commission system, ensuring your earnings structure is easy to understand, fair, and openly shared across all levels.",
  },
  {
    icon: Users,
    title: "Expansive Referral Network",
    description:
      "Build your downline and earn compounding passive income from 4 levels of successful referrals, creating a sustainable growth engine for your brand.",
  },
  {
    icon: TrendingUp,
    title: "Growth Analytics",
    description:
      "Track your progress with detailed, real-time analytics. Gain actionable insights to optimize your content strategy and maximize your overall earning potential.",
  },
  {
    icon: Shield,
    title: "Fortified Security",
    description:
      "Your data and earnings are protected with bank-grade security and secure UPI integration, providing peace of mind as you grow your digital empire.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
};

const FeatureCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative h-full w-full overflow-hidden rounded-2xl bg-white p-8 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`radial-gradient(350px at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.1), transparent 80%)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
        style={{
          background: useMotionTemplate`radial-gradient(350px at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export function FeaturesSection() {
  const [mainFeature, ...otherFeatures] = featuresList;

  const iconStyles = [
    {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-500 dark:text-sky-400",
    },
    {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-500 dark:text-green-400",
    },
    {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-500 dark:text-amber-400",
    },
    {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-500 dark:text-rose-400",
    },
  ];

  return (
    <section className="py-10 sm:py-10 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            An Unfair Advantage for Creators
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Our platform is more than just a tool—it's your strategic partner in
            building a digital empire, one feature at a time.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div
            className="lg:col-span-2 lg:row-span-2"
            variants={itemVariants}
          >
            <FeatureCard className="flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 dark:bg-sky-900/30 mb-6">
                  <mainFeature.icon className="h-7 w-7 text-indigo-500 dark:text-sky-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  {mainFeature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {mainFeature.description}
                </p>
              </div>
              <div className="mt-8 -mx-8 -mb-8">
                <div className="relative h-48 w-full">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 180"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 hidden dark:block"
                  >
                    <defs>
                      <linearGradient
                        id="darkGraphGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.2)" />
                        <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 150 C 40 120, 80 100, 120 110 S 200 140, 240 100, 280 40, 320 60, 360 120, 400 130 L 400 180 L 0 180 Z"
                      fill="url(#darkGraphGradient)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 180"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 dark:hidden"
                  >
                    <defs>
                      <linearGradient
                        id="lightGraphGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "rgba(99, 102, 241, 0.2)" }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "rgba(99, 102, 241, 0)" }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 150 C 40 120, 80 100, 120 110 S 200 140, 240 100, 280 40, 320 60, 360 120, 400 130 L 400 180 L 0 180 Z"
                      fill="url(#lightGraphGradient)"
                      stroke="#6366f1"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              </div>
            </FeatureCard>
          </motion.div>

          {otherFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard>
                <div
                  className={`flex items-center justify-center h-14 w-14 rounded-full mb-6 ${iconStyles[index].bg}`}
                >
                  <feature.icon
                    className={`h-7 w-7 ${iconStyles[index].text}`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </FeatureCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}