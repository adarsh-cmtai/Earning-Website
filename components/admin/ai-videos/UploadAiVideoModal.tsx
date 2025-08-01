import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { uploadAiVideo } from "@/lib/redux/features/admin/technicianSlice";
import { fetchAdminTopics } from "@/lib/redux/features/admin/adminTopicsSlice";
import { toast } from "sonner";

interface UploadAiVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadAiVideoModal({ isOpen, onClose }: UploadAiVideoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { list: topics, status: topicsStatus } = useSelector((state: RootState) => state.adminTopics);

  const [formData, setFormData] = useState({ title: '', description: '', topic: '', type: 'Short' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
        dispatch(fetchAdminTopics());
    }
  }, [isOpen, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !formData.title || !formData.topic || !formData.type || !formData.description) {
        toast.error("Please fill all fields and select a video file.");
        return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Uploading video to S3...");
    const data = new FormData();
    data.append('videoFile', videoFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('topic', formData.topic);
    data.append('type', formData.type);

    try {
        await dispatch(uploadAiVideo(data)).unwrap();
        toast.success("Video uploaded successfully!", { id: toastId });
        setFormData({ title: '', description: '', topic: '', type: 'Short' });
        setVideoFile(null);
        onClose();
    } catch (error: any) {
        toast.error(error || "Upload failed. Please try again.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Upload New AI Video</DialogTitle><DialogDescription>Provide metadata and the video file. The system will handle allocation.</DialogDescription></DialogHeader>
        <div className="grid gap-6 py-4">
          <div><Label htmlFor="video-file">Video File</Label><Input id="video-file" type="file" accept="video/*" onChange={handleFileChange} disabled={isLoading} /></div>
          <div><Label htmlFor="video-title">Video Title</Label><Input id="video-title" placeholder="e.g., 5 Tips for Financial Freedom" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={isLoading} /></div>
          <div><Label htmlFor="video-description">Video Description</Label><Input id="video-description" placeholder="A brief description for the video..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={isLoading} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Topic</Label>
              <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})} disabled={isLoading || topicsStatus === 'loading'}>
                <SelectTrigger><SelectValue placeholder={topicsStatus === 'loading' ? 'Loading...' : 'Select a topic'} /></SelectTrigger>
                <SelectContent>{topics.map((topic) => (<SelectItem key={topic._id} value={topic.name}>{topic.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div><Label>Video Type</Label><RadioGroup value={formData.type} defaultValue="Short" className="flex items-center space-x-2 pt-2" onValueChange={(value) => setFormData({...formData, type: value})}><div className="flex items-center space-x-2"><RadioGroupItem value="Short" id="r-short" disabled={isLoading}/><Label htmlFor="r-short">Short</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Long" id="r-long" disabled={isLoading}/><Label htmlFor="r-long">Long</Label></div></RadioGroup></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button><Button onClick={handleUpload} disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload Video'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}