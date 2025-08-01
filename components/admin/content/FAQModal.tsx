import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type FaqItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { addFaq, updateFaq } from "@/lib/redux/features/admin/contentSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categories = ["Getting Started", "Earnings & Payments", "Daily Assignments", "AI Videos & Social Media", "Support & Security"];

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FaqItem;
}

export function FAQModal({ isOpen, onClose, faq }: FAQModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
        setQuestion(faq?.question || '');
        setAnswer(faq?.answer || '');
        setCategory(faq?.category || '');
    }
  }, [isOpen, faq]);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim() || !category) {
        toast.error("All fields (Question, Answer, and Category) are required.");
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading(`${faq ? 'Updating' : 'Adding'} FAQ...`);
    try {
        if (faq?._id) {
            await dispatch(updateFaq({ _id: faq._id, question, answer, category })).unwrap();
        } else {
            await dispatch(addFaq({ question, answer, category })).unwrap();
        }
        toast.success("FAQ saved successfully.", { id: toastId });
        onClose();
    } catch (error: any) {
        toast.error(error || "Failed to save FAQ.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormInvalid = !question.trim() || !answer.trim() || !category;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>{faq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle><DialogDescription>Enter the question, its answer, and assign it to a category.</DialogDescription></DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger id="category"><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g., How do I reset my password?" disabled={isLoading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Provide a clear and concise answer." className="resize-y" disabled={isLoading}/>
          </div>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading || isFormInvalid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {faq ? 'Save Changes' : 'Add FAQ'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}