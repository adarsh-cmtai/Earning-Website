"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { saveSelectedTopic } from "@/lib/redux/features/user/profileSetupSlice";
import { fetchTopics } from "@/lib/redux/features/topicsSlice";
import { toast } from "sonner";
import { ArrowLeft, Check, Flame, Bitcoin, Handshake, Briefcase, Heart, Cpu, Palette, Film, Globe, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const getTopicStyling = (topicName: string) => {
    const name = topicName.toLowerCase();
    if (name.includes("motivation")) return { Icon: Flame, gradient: "from-orange-500 to-red-500" };
    if (name.includes("crypto")) return { Icon: Bitcoin, gradient: "from-amber-500 to-orange-500" };
    if (name.includes("business")) return { Icon: Briefcase, gradient: "from-sky-500 to-indigo-500" };
    if (name.includes("relationship")) return { Icon: Handshake, gradient: "from-rose-500 to-pink-500" };
    if (name.includes("health")) return { Icon: Heart, gradient: "from-emerald-500 to-green-500" };
    if (name.includes("ai")) return { Icon: Bot, gradient: "from-purple-500 to-violet-500" };
    if (name.includes("art")) return { Icon: Palette, gradient: "from-yellow-500 to-amber-500" };
    if (name.includes("movie")) return { Icon: Film, gradient: "from-slate-600 to-slate-800" };
    return { Icon: Globe, gradient: "from-cyan-500 to-blue-500" };
};

const TopicSkeleton = () => (
    [...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-2xl bg-card">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-28" />
        </div>
    ))
);


export function TopicSelectionStep({ formData, updateFormData, onNext, onBack }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { list: topics, status } = useSelector((state: RootState) => state.topics);

  const [selectedTopic, setSelectedTopic] = useState(formData.selectedTopic || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (status === 'idle') {
        dispatch(fetchTopics());
    }
  }, [status, dispatch]);

  const handleConfirm = async () => {
    if (!selectedTopic) {
        toast.error("Please select a topic to continue.");
        return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Saving your topic selection...");
    try {
        await dispatch(saveSelectedTopic(selectedTopic)).unwrap();
        updateFormData({ selectedTopic });
        toast.success("Topic saved successfully!", { id: toastId });
        onNext();
    } catch (error: any) {
        toast.error(error.message || "Failed to save topic.", { id: toastId });
    } finally {
        setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };


  return (
    <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center p-8 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-black">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose Your Content Niche</h2>
            <p className="mt-3 text-lg text-muted-foreground">Select one topic for your AI-generated videos. This will define your channel's theme.</p>
        </div>
        
        <AnimatePresence mode="wait">
            {status === 'loading' ? (
                <motion.div 
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    <TopicSkeleton />
                </motion.div>
            ) : (
                <motion.div 
                    key="topics"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {topics.map((topic) => {
                        const isSelected = selectedTopic === topic.name;
                        const { Icon, gradient } = getTopicStyling(topic.name);
                        return (
                        <motion.button 
                            key={topic._id} 
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTopic(topic.name)} 
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-4 p-5 text-center border rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none",
                                isSelected 
                                    ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-black dark:ring-teal-400 bg-card' 
                                    : 'bg-card border-border hover:border-primary/30'
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
                                    className="absolute top-2 right-2 h-6 w-6 bg-primary dark:bg-teal-400 text-primary-foreground rounded-full flex items-center justify-center"
                                >
                                    <Check className="h-4 w-4" />
                                </motion.div>
                            )}
                            <div className={cn(
                                `w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br text-white`,
                                gradient
                            )}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <span className="font-semibold text-foreground text-base">
                                {topic.name}
                            </span>
                        </motion.button>
                        )
                    })}
                </motion.div>
            )}
        </AnimatePresence>
        
        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="w-full sm:w-auto h-12 text-base">
                <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            <Button 
                onClick={handleConfirm} 
                disabled={!selectedTopic || isSubmitting} 
                className="w-full h-12 text-base font-bold"
                size="lg"
            >
                {isSubmitting ? 'Saving...' : 'Confirm & Continue'}
            </Button>
        </div>
    </div>
  );
}