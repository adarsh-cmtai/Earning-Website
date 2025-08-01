"use client";

import { Quote } from "lucide-react";
import { motion, Variants } from "framer-motion";
import React from "react";

const testimonials = [
  {
    quote:
      "The transparency of the referral system is unmatched. I can track every single earning, and the daily payouts have been a game-changer.",
    name: "Priya Sharma",
    title: "Top Earner, Maharashtra",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "I had zero experience. The AI video tool made it incredibly easy to get started. I saw my first Social Media earnings in just two months!",
    name: "Rajesh Kumar",
    title: "Digital Creator, Delhi",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The platform's support team is incredible. They are responsive, helpful, and genuinely invested in my success. It feels like a true partnership.",
    name: "Anjali Singh",
    title: "Community Leader, Bangalore",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The daily tasks are simple, yet effective. It's the most consistent and reliable online earning platform I have ever used. Highly recommended!",
    name: "Vikram Rathod",
    title: "Freelancer, Gujarat",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    quote:
      "Building a downline was easier than I thought. The passive income from the 5-level system is real and grows every month.",
    name: "Meena Desai",
    title: "Network Marketer, Pune",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
  },
];

// --- UPDATED Marquee Variants for a seamless loop ---
const marqueeVariants: Variants = {
  animate: {
    // We are moving the container by -50% because we have two identical lists.
    // This makes the second list start exactly where the first one ends.
    x: [0, "-50%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 50, // Increase duration for a slower, more elegant scroll
        ease: "linear",
      },
    },
  },
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => (
  <div className="relative w-[380px] md:w-[420px] flex-shrink-0 group-hover:[animation-play-state:paused] transition-transform duration-300 hover:!scale-105">
    <div className="relative rounded-2xl bg-white dark:bg-slate-800 p-8 pb-20 shadow-lg border border-transparent dark:border-slate-700/50">
      <Quote className="absolute top-6 left-6 h-16 w-16 text-gray-100 dark:text-slate-700/50" />
      <blockquote className="relative z-10 text-lg font-medium text-gray-700 dark:text-slate-300 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>
    </div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[85%]">
      <div className="flex items-center gap-x-4 bg-gradient-to-tr from-white to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 shadow-xl border border-gray-200/50 dark:border-slate-600/50">
        <img
          className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-slate-600"
          src={testimonial.avatar}
          alt={testimonial.name}
          loading="lazy"
        />
        <div>
          <p className="font-bold text-lg text-gray-900 dark:text-slate-100">
            {testimonial.name}
          </p>
          <p className="text-sm text-primary dark:text-teal-400 font-medium">
            {testimonial.title}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export function TestimonialsSection() {
  return (
    <section className="py-8 bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Voices of Success
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            Don't just take our word for it. Here's what our successful members
            are saying about their journey with us.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Fading overlay on the sides */}
        <div className="absolute inset-0 z-10 [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] dark:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"></div>

        <div className="group flex overflow-hidden">
          <motion.div
            className="flex gap-8 shrink-0 pt-2 pb-12 px-4"
            variants={marqueeVariants}
            animate="animate"
          >
            {/* --- RENDER THE LIST TWICE FOR SEAMLESS LOOP --- */}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-a-${index}`}
                testimonial={testimonial}
              />
            ))}
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`testimonial-b-${index}`}
                testimonial={testimonial}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
