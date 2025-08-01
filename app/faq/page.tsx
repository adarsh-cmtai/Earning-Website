"use client";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, ChevronDown, Clapperboard, ClipboardList, HelpCircle, LifeBuoy, Mail, MessageCircle, Rocket, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchPublicContent } from "@/lib/redux/features/publicContentSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { type FaqItem } from "@/lib/types";

export default function FAQPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { faq: rawFaqData, status } = useSelector((state: RootState) => state.publicContent);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Getting Started");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicContent());
    }
  }, [status, dispatch]);

  const faqData = useMemo(() => {
    const categories: Record<string, FaqItem[]> = {
        "Getting Started": [], "Earnings & Payments": [], "Daily Assignments": [], "AI Videos & Social Media": [], "Support & Security": []
    };
    rawFaqData.forEach(faq => {
        // This is a placeholder for real categorization logic from the backend
        const categoryKey = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
        categories[categoryKey].push(faq);
    });

    return [
        { category: "Getting Started", icon: Rocket, faqs: categories["Getting Started"] },
        { category: "Earnings & Payments", icon: Banknote, faqs: categories["Earnings & Payments"] },
        { category: "Daily Assignments", icon: ClipboardList, faqs: categories["Daily Assignments"] },
        { category: "AI Videos & Social Media", icon: Clapperboard, faqs: categories["AI Videos & Social Media"] },
        { category: "Support & Security", icon: LifeBuoy, faqs: categories["Support & Security"] },
    ];
  }, [rawFaqData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return faqData.find(cat => cat.category === activeCategory);
    }
    const results = faqData.map(category => ({ ...category, faqs: category.faqs.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) })).filter(category => category.faqs.length > 0);
    return { category: "Search Results", faqs: results.flatMap(r => r.faqs) };
  }, [searchTerm, activeCategory, faqData]);

  const FaqSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white font-sans">
      <Header />
      <main>
        <section className="py-12 md:py-12 relative text-center overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 dark:bg-teal-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-sky-500/5 dark:bg-sky-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">How can we help?</h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">Find answers, tutorials, and deep-dives into our platform's features.</p>
              <div className="max-w-2xl mx-auto"><div className="relative"><Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" /><Input placeholder="Search for answers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-14 pl-14 pr-4 w-full text-lg bg-white/80 dark:bg-slate-900/80 border-gray-300 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary dark:focus:ring-teal-500"/></div></div>
            </motion.div>
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800 dark:text-slate-300 mb-4 px-3">Categories</h2>
                <nav className="space-y-1">
                  {faqData.map((cat) => (
                    <button key={cat.category} onClick={() => { setActiveCategory(cat.category); setSearchTerm(""); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-base font-medium ${activeCategory === cat.category && !searchTerm ? "bg-primary/10 text-primary dark:bg-teal-500/10 dark:text-teal-300" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50"}`}><cat.icon className="h-5 w-5 flex-shrink-0" /><span>{cat.category}</span></button>
                  ))}
                </nav>
              </aside>
              <div className="md:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div key={searchTerm || activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    {status === 'loading' ? <FaqSkeleton /> : !filteredData || filteredData.faqs.length === 0 ? (
                      <div className="text-center py-20"><HelpCircle className="h-16 w-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">No Results Found</h3><p className="text-muted-foreground">Your search for "{searchTerm}" didn't yield any results.</p></div>
                    ) : (
                      <div className="space-y-4"><h2 className="text-3xl font-bold mb-6">{filteredData.category}</h2>
                        {filteredData.faqs.map((faq, index) => (
                           <Collapsible key={index} className="border-b last:border-b-0">
                           <CollapsibleTrigger className="w-full text-left py-5 flex justify-between items-center group"><h3 className="font-semibold text-lg group-hover:text-primary pr-4">{faq.question}</h3><ChevronDown className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180 flex-shrink-0" /></CollapsibleTrigger>
                           <CollapsibleContent><div className="pb-5 pr-8"><p className="text-muted-foreground leading-relaxed max-w-prose">{faq.answer}</p></div></CollapsibleContent>
                         </Collapsible>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-6xl">
             <div className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden bg-muted/30 border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Our support team is ready to assist you. Reach out and we'll get back to you as soon as possible.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg"><MessageCircle className="mr-2 h-5 w-5" />Chat With Us</Button>
                    <Button size="lg" variant="outline"><Mail className="mr-2 h-5 w-5" />Email Support</Button>
                    </div>
                </div>
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}