"use client";

import { Quote } from "lucide-react";
import { motion, Variants } from "framer-motion";
import React from "react";

const testimonials = [
  // --- 🇪🇺 Western/European Names ---
  {
    quote:
      "The transparency of the referral system is unmatched. I can track every single earning, and the daily payouts have been a game-changer.",
    name: "Olivia Bennett",
    title: "Top Earner, United Kingdom",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "I had zero experience. The AI video tool made it incredibly easy to get started. I saw my first Social Media earnings in just two months!",
    name: "Ethan Clarke",
    title: "Digital Creator, USA",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The platform's support team is incredible. They are responsive, helpful, and genuinely invested in my success. It feels like a true partnership.",
    name: "Isabella Moreau",
    title: "Community Leader, France",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The daily tasks are simple, yet effective. It's the most consistent and reliable online earning platform I have ever used. Highly recommended!",
    name: "Lucas Fischer",
    title: "Freelancer, Germany",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    quote:
      "Building a downline was easier than I thought. The passive income from the 4-level system is real and grows every month.",
    name: "Amelia Novak",
    title: "Network Marketer, Poland",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
  },
  {
    quote:
      "The transparency of the referral system is unmatched. I can track every single earning, and the daily payouts have been a game-changer.",
    name: "Noah Jensen",
    title: "Top Earner, Denmark",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1888&auto=format&fit=crop",
  },
  // --- 🇮🇳 Central Indian Names ---
  {
    quote:
      "I had zero experience. The AI video tool made it incredibly easy to get started. I saw my first Social Media earnings in just two months!",
    name: "Rohan Verma",
    title: "Digital Creator, Uttar Pradesh",
    avatar:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The platform's support team is incredible. They are responsive, helpful, and genuinely invested in my success. It feels like a true partnership.",
    name: "Sneha Tripathi",
    title: "Community Leader, Madhya Pradesh",
    avatar:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The daily tasks are simple, yet effective. It's the most consistent and reliable online earning platform I have ever used. Highly recommended!",
    name: "Aniket Sharma",
    title: "Top Earner, Rajasthan",
    avatar:
      "https://images.unsplash.com/photo-1522556189639-b150ed9c4331?q=80&w=1887&auto=format&fit=crop",
  },
  // --- 🌄 Northeast India Names ---
  {
    quote:
      "Building a downline was easier than I thought. The passive income from the 4-level system is real and grows every month.",
    name: "Mary Lyngdoh",
    title: "Network Marketer, Meghalaya",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
  },
  {
    quote:
      "The transparency of the referral system is unmatched. I can track every single earning, and the daily payouts have been a game-changer.",
    name: "Yurngam Ngalung",
    title: "Top Earner, Manipur",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "I had zero experience. The AI video tool made it incredibly easy to get started. I saw my first Social Media earnings in just two months!",
    name: "Rakesh Ningthoujam",
    title: "Digital Creator, Manipur",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
  },
  {
    quote:
      "The platform's support team is incredible. They are responsive, helpful, and genuinely invested in my success. It feels like a true partnership.",
    name: "Anjali Zeliang",
    title: "Community Leader, Nagaland",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop",
  },
  {
    quote:
      "The daily tasks are simple, yet effective. It's the most consistent and reliable online earning platform I have ever used. Highly recommended!",
    name: "David Haokip",
    title: "Freelancer, Mizoram",
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    quote:
      "Building a downline was easier than I thought. The passive income from the 4-level system is real and grows every month.",
    name: "Arenla Jamir",
    title: "Top Earner, Nagaland",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
  },
  {
    quote:
      "The transparency of the referral system is unmatched. I can track every single earning, and the daily payouts have been a game-changer.",
    name: "Moses Abonmai",
    title: "Digital Creator, Assam",
    avatar:
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1974&auto=format&fit=crop",
  },
  {
    quote:
      "I had zero experience. The AI video tool made it incredibly easy to get started. I saw my first Social Media earnings in just two months!",
    name: "Samuel Swer",
    title: "Community Leader, Meghalaya",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1887&auto=format&fit=crop",
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