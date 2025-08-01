"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { saveChannelName } from "@/lib/redux/features/user/profileSetupSlice";
import { toast } from "sonner";
import { ArrowLeft, Youtube, Wand, PartyPopper, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ChannelNameStep({ formData, updateFormData, onNext, onBack }: any) {
  const [selectedOption, setSelectedOption] = useState("");
  const [customName, setCustomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const suggestedNames = useMemo(() => {
    const namePart = formData.fullName?.split(' ')[0] || "Creator";
    const topicPart = formData.selectedTopic || "World";
    return [`${namePart}'s ${topicPart} Hub`, `${topicPart} Insights by ${namePart}`, `${namePart} Explores ${topicPart}`];
  }, [formData.fullName, formData.selectedTopic]);

  useEffect(() => {
    if (!selectedOption && suggestedNames.length > 0) {
      setSelectedOption(suggestedNames[0]);
    }
  }, [suggestedNames, selectedOption]);

  const finalName = selectedOption === 'custom' ? customName : selectedOption;

  const handleFinalize = async () => {
    if (!finalName.trim()) {
        toast.error("Please select or enter a channel name.");
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Finalizing your channel...");
    try {
        await dispatch(saveChannelName(finalName)).unwrap();
        updateFormData({ channelName: finalName });
        toast.success("Channel name created successfully!", { id: toastId });
        onNext();
    } catch (error: any) {
        toast.error(error.message || "Failed to save channel name.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center p-8 space-y-4">
            <div className="inline-block p-4 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 rounded-full">
                <Wand className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Create Your Channel Name</h2>
            <p className="mt-3 text-lg text-muted-foreground">This is the final step. Pick a name that represents you.</p>
        </div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
            {[...suggestedNames, "custom"].map((name, i) => {
                const isCustom = name === "custom";
                const isSelected = selectedOption === name;

                return (
                <div key={i}>
                    <RadioGroupItem value={name} id={`name-${i}`} className="peer sr-only"/>
                    <Label htmlFor={`name-${i}`} className={cn(
                        "relative flex flex-col justify-center rounded-xl border p-4 cursor-pointer transition-colors duration-300",
                        "hover:bg-muted/50",
                        isSelected ? "border-primary/50" : "border-border"
                    )}>
                        {isSelected && (
                            <motion.div 
                                layoutId="selected-background"
                                className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-xl"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <div className="relative z-10 flex items-center gap-4">
                            <Youtube className="h-7 w-7 text-red-500 flex-shrink-0" />
                            <span className="font-semibold text-lg flex-grow text-left">
                                {isCustom ? "Create my own" : name}
                            </span>
                        </div>
                        <AnimatePresence>
                        {isCustom && isSelected && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden z-10"
                            >
                                <div className="relative">
                                    <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                    <Input 
                                        placeholder="Your unique channel name..." 
                                        value={customName} 
                                        onChange={(e) => setCustomName(e.target.value)} 
                                        className="h-12 text-base pl-10"
                                    />
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </Label>
                </div>
            )})}
        </RadioGroup>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onBack} disabled={isLoading} className="w-full sm:w-auto h-12 text-base">
                <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            <Button 
                onClick={handleFinalize} 
                disabled={!finalName || isLoading} 
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                size="lg"
            >
                {isLoading ? (
                    'Saving...'
                 ) : (
                    <>
                    <PartyPopper className="mr-2 h-5 w-5" />
                    Finalize & Complete Setup
                    </>
                 )}
            </Button>
        </div>
    </div>
  );
}