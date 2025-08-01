import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type TutorialItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { addTutorial, updateTutorial } from "@/lib/redux/features/admin/contentSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial?: TutorialItem;
}

export function TutorialModal({ isOpen, onClose, tutorial }: TutorialModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (isOpen) {
        setTitle(tutorial?.title || '');
        setUrl(tutorial?.url || '');
    } else {
        setTitle('');
        setUrl('');
    }
  }, [isOpen, tutorial]);
  
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
        toast.error("Both title and URL fields are required.");
        return;
    }
    if (!isValidUrl(url)) {
        toast.error("Please enter a valid URL (e.g., https://...).");
        return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading(`${tutorial ? 'Updating' : 'Adding'} tutorial...`);
    
    try {
        if (tutorial?._id) {
            await dispatch(updateTutorial({ _id: tutorial._id, title, url })).unwrap();
        } else {
            await dispatch(addTutorial({ title, url })).unwrap();
        }
        toast.success("Tutorial saved successfully.", { id: toastId });
        onClose();
    } catch (error: any) {
        toast.error(error.message || "Failed to save tutorial.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };
  
  const isFormInvalid = !title.trim() || !url.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{tutorial ? 'Edit Tutorial' : 'Add New Tutorial'}</DialogTitle>
          <DialogDescription>
            Provide a title and a valid URL for the video tutorial. This will be shown to users to help them get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Video Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to Create Your First Video"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">Video URL</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://www.youtube.com/watch?v=..." 
              type="url"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading || isFormInvalid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tutorial ? 'Save Changes' : 'Add Tutorial'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}