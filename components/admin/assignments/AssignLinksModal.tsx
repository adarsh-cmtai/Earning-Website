"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type User } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { assignLinks, assignLinksCsv } from "@/lib/redux/features/admin/technicianSlice";
import { toast } from "sonner";
import { format } from 'date-fns';

interface AssignLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function AssignLinksModal({ isOpen, onClose, user }: AssignLinksModalProps) {
  const [activeTab, setActiveTab] = useState('paste');
  const [shortLinks, setShortLinks] = useState('');
  const [longLinks, setLongLinks] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) return null;

  const handleAssign = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Assigning links to ${user.fullName}...`);

    try {
        if (activeTab === 'paste') {
            const shortLinksArray = shortLinks.split('\n').filter(link => link.trim().startsWith('http'));
            const longLinksArray = longLinks.split('\n').filter(link => link.trim().startsWith('http'));
            if (shortLinksArray.length === 0 && longLinksArray.length === 0) {
                toast.error("Please provide at least one valid link.", { id: toastId });
                setIsLoading(false);
                return;
            }
            await dispatch(assignLinks({ userId: user._id, date: format(new Date(), 'yyyy-MM-dd'), shortLinks: shortLinksArray, longLinks: longLinksArray })).unwrap();
        } else {
            if (!csvFile) {
                toast.error("Please select a CSV file.", { id: toastId });
                setIsLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append('userId', user._id);
            formData.append('date', format(new Date(), 'yyyy-MM-dd'));
            formData.append('csvFile', csvFile);
            await dispatch(assignLinksCsv(formData)).unwrap();
        }
        
        toast.success("Links assigned successfully!", { id: toastId });
        setShortLinks('');
        setLongLinks('');
        setCsvFile(null);
        onClose();
    } catch (error: any) {
        toast.error(error.message || "Failed to assign links.", { id: toastId });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>Assign Daily Links</DialogTitle><DialogDescription>Assign Short and Long video links for {user.fullName} for today, {format(new Date(), 'PPP')}.</DialogDescription></DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste">Paste Links</TabsTrigger>
                <TabsTrigger value="csv">Upload CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="short-links">Short Video Links (one per line)</Label>
                        <Textarea id="short-links" value={shortLinks} onChange={(e) => setShortLinks(e.target.value)} rows={10} placeholder="https://youtube.com/shorts/..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="long-links">Long Video Links (one per line)</Label>
                        <Textarea id="long-links" value={longLinks} onChange={(e) => setLongLinks(e.target.value)} rows={10} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="csv" className="py-4">
                <div className="space-y-2">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input id="csv-file" type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)} />
                    <p className="text-xs text-muted-foreground">CSV must have two columns: 'url' and 'type' (can be 'Short' or 'Long').</p>
                </div>
            </TabsContent>
        </Tabs>
        <DialogFooter><Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button><Button onClick={handleAssign} disabled={isLoading}>{isLoading ? 'Assigning...' : 'Assign Links'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
