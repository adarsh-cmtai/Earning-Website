"use client";

import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

const fadeInStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden ">
      {/* 🔹 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/video/b1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔹 Overlay for both light/dark modes */}
      <div className="absolute inset-0 bg-black/60 backdrop-brightness-75 dark:backdrop-brightness-50 z-10" />

      {/* 🔹 Content */}
      <div className="relative z-20 container mx-auto px-4 py-24 md:py-32 lg:py-40 text-center text-white">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInStagger}
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Empower Your Income,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
              Grow Your Digital Presence
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-200"
          >
            Join the Universal Employment & Income Empowerment Platform and
            transform your earning potential through AI-powered content creation
            and strategic referrals.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-black hover:bg-slate-100 font-semibold text-base px-8 py-6 rounded-full shadow-lg"
              asChild
            >
              <Link href="/register">
                Join Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-white hover:bg-white/10"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-white"
          >
            <div className="text-center border-t border-white/20 md:border-t-0 md:border-l md:first:border-l-0 pt-6 md:pt-0 md:pl-6">
              <div className="text-4xl font-semibold">10K+</div>
              <div className="mt-1 text-slate-300">Active Admins</div>
            </div>

            {/* --- UPDATED STATS BLOCK FOR BETTER RESPONSIVENESS --- */}
            <div className="text-center border-t border-white/20 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
              <div className="text-4xl font-semibold">₹50L+</div>
              {/* Reduced font size here to prevent hiding on larger screens */}
              <div className="text-2xl font-semibold">needs to rectified</div>
              <div className="mt-1 text-slate-300">Total Earnings</div>
            </div>

            <div className="text-center border-t border-white/20 md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
              <div className="text-4xl font-semibold">95%</div>
              <div className="mt-1 text-slate-300">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}