"use client"

import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

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
}

const avatars = [
  "/images/Home/testimonial1.jpg",
  "/images/Home/testimonial1.jpg",
  "/images/Home/testimonial1.jpg",
  "/images/Home/testimonial1.jpg",
  "/images/Home/testimonial1.jpg",
]

export function CtaSection() {
  return (
    <section className="relative py-10 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80rem] h-[80rem] bg-radial-gradient from-primary/5 dark:from-teal-500/10 to-transparent opacity-50"></div>
        <div className="absolute -bottom-48 -left-1/4 w-[60rem] h-[60rem] bg-radial-gradient from-sky-500/5 dark:from-sky-500/10 to-transparent opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="flex -space-x-2 mb-8" variants={itemVariants}>
            {avatars.map((avatar, index) => (
              <img
                key={index}
                className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-slate-700"
                src={avatar}
                alt={`Admin ${index + 1}`}
              />
            ))}
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent"
          >
            Ready to Build Your Digital Empire?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-slate-400"
          >
            Join thousands of creators who are already transforming their income. Your journey to financial freedom starts now.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary text-primary-foreground 
                dark:bg-white/10 dark:text-slate-100 dark:backdrop-blur-sm dark:border dark:border-white/20 
                dark:hover:bg-white/20 font-bold text-base px-10 py-6 rounded-full 
                shadow-lg shadow-primary/20 dark:shadow-[0_0_20px_theme(colors.teal.500/50%)] 
                transition-all hover:scale-105" 
                asChild
            >
              <Link href="/register">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              Already a member?{" "}
              <Link href="/login" className="font-semibold text-primary dark:text-slate-300 hover:text-primary-hover dark:hover:text-white transition-colors">
                Log In
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
