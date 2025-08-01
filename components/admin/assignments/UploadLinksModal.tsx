import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from 'date-fns';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { uploadAssignmentLinks, uploadAssignmentCsv } from "@/lib/redux/features/admin/technicianSlice";
import { toast } from "sonner";

interface UploadLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadLinksModal({ isOpen, onClose }: UploadLinksModalProps) {
  const [shortLinksText, setShortLinksText] = useState('');
  const [longLinksText, setLongLinksText] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handlePasteUpload = async () => {
    const shortLinks = shortLinksText.split('\n').filter(link => link.trim().startsWith('http')).map(url => ({ url, type: 'Short' as const }));
    const longLinks = longLinksText.split('\n').filter(link => link.trim().startsWith('http')).map(url => ({ url, type: 'Long' as const }));
    const allLinks = [...shortLinks, ...longLinks];

    if (allLinks.length === 0) {
        toast.error("Please paste at least one valid video link.");
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Uploading pasted links...");
    try {
        const payload = { date: format(new Date(), 'yyyy-MM-dd'), links: allLinks };
        await dispatch(uploadAssignmentLinks(payload)).unwrap();
        toast.success("Links uploaded successfully!", { id: toastId });
        setShortLinksText('');
        setLongLinksText('');
        onClose();
    } catch (error: any) {
        toast.error(error || "Upload failed. A batch for today may already exist.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
        toast.error("Please select a CSV file to upload.");
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Uploading and parsing CSV file...");
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('date', format(new Date(), 'yyyy-MM-dd'));
    try {
        await dispatch(uploadAssignmentCsv(formData)).unwrap();
        toast.success("CSV uploaded and links prepared successfully!", { id: toastId });
        setCsvFile(null);
        onClose();
    } catch (error: any) {
        toast.error(error || "CSV upload failed. Please check the file format.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Upload Daily Video Links</DialogTitle><DialogDescription>Upload links for today's assignment. This can only be done once per day.</DialogDescription></DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="paste">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="paste">Paste Links</TabsTrigger><TabsTrigger value="csv">Upload CSV</TabsTrigger></TabsList>
            <TabsContent value="paste" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="short-links-textarea">Short Video Links (55s)</Label>
                        <Textarea id="short-links-textarea" rows={10} placeholder="https://youtube.com/shorts/..." value={shortLinksText} onChange={(e) => setShortLinksText(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="long-links-textarea">Long Video Links (10m)</Label>
                        <Textarea id="long-links-textarea" rows={10} placeholder="https://youtube.com/watch?v=..." value={longLinksText} onChange={(e) => setLongLinksText(e.target.value)} />
                    </div>
                </div>
                <Button onClick={handlePasteUpload} disabled={isLoading} className="w-full">{isLoading ? 'Uploading...' : 'Upload Pasted Links'}</Button>
            </TabsContent>
            <TabsContent value="csv" className="mt-4 space-y-4">
              <div><Label htmlFor="csv-file">CSV File</Label><Input id="csv-file" type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)} /></div>
              <p className="text-xs text-muted-foreground">CSV must have two columns: 'url' and 'type' (Short/Long), and no header row.</p>
              <Button onClick={handleCsvUpload} disabled={isLoading} className="w-full">{isLoading ? 'Uploading...' : 'Upload CSV File'}</Button>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}