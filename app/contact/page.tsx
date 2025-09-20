"use client";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Image from "next/image";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    contact: "support@veranix-ai.com",
    cta: "Send Email",
  },
  {
    icon: Phone,
    title: "Phone Support",
    contact: "+91 7629037269",
    cta: "Call Now",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    contact: "Chat with us",
    cta: "Start Chat",
  },
];

const faqs = [
  {
    question: "How quickly can I expect a response?",
    answer:
      "We are committed to prompt service. You can expect a response to all email inquiries within 24 hours. For urgent matters, our phone and WhatsApp channels are available during business hours.",
  },
  {
    question: "What information should I include in my message?",
    answer:
      "To help us resolve your issue quickly, please include your Admin ID (if you're a member), a clear description of the problem, and any relevant screenshots or details.",
  },
  {
    question: "Are your support channels available 24/7?",
    answer:
      "Our email support is monitored 24/7 for urgent issues. Live phone and WhatsApp support operate from 9 AM to 6 PM IST, Monday through Saturday.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-slate-950 text-gray-800 dark:text-white overflow-x-hidden">
      <Header />
      <main>
        {/* --- HERO BANNER SECTION STARTS HERE (MODIFIED) --- */}
        <section className="relative py-16 md:py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
              alt="Customer support team working"
              fill
              priority
              placeholder="empty"
              quality={100}
              className="object-cover"
            />
            {/* Overlay to match the HeroSection */}
            <div className="absolute inset-0 bg-black/60 backdrop-brightness-75 dark:backdrop-brightness-50"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Headline styled like HeroSection */}
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
                  Connect With Us
                </span>
              </h1>
              {/* Paragraph styled like HeroSection */}
              <p className="mt-6 text-xl md:text-2xl text-slate-200">
                Your partner in success. We are here to provide the support and
                answers you need on your journey.
              </p>
            </motion.div>
          </div>
        </section>
        {/* --- HERO BANNER SECTION ENDS HERE --- */}

        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                className="lg:col-span-2 p-8 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-800"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                  Send a Direct Message
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-8">
                  Our team is ready to assist you. Fill out the form below.
                </p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-600 dark:text-slate-400"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-gray-600 dark:text-slate-400"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-600 dark:text-slate-400"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-gray-600 dark:text-slate-400"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      className="min-h-[140px] bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg shadow-primary/30 transition-all"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Submit Inquiry
                  </Button>
                </form>
              </motion.div>

              <div className="space-y-8">
                {contactMethods.map((method, i) => (
                  <motion.div
                    key={method.title}
                    className="p-6 bg-gray-50/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-800"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                        <method.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-200">
                          {method.title}
                        </h4>
                        <p className="text-gray-600 dark:text-slate-400 text-sm">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary hover:bg-primary/10"
                    >
                      {method.cta}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                  Quick Answers
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b-gray-200 dark:border-b-slate-800"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-800 dark:text-slate-200 hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                  Our Headquarters
                </h2>
                <div className="relative aspect-video w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900 p-4 overflow-hidden">
                  <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                  <div className="absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-full rounded-full bg-primary/20 animate-ping"></div>
                  </div>
                  <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                  <p className="text-gray-600 dark:text-slate-400">
                    UEIEP Headquarters, Mumbai, Maharashtra, India
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
