"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAssignmentBatches, distributeAssignments } from "@/lib/redux/features/admin/technicianSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, PlayCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type AssignmentBatch } from "@/lib/types";
import { UploadLinksModal } from "@/components/admin/assignments/UploadLinksModal";
import { ViewNonCompliantModal } from "@/components/admin/assignments/ViewNonCompliantModal";
import { format } from 'date-fns';
import { toast } from "sonner";

export default function AssignmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, status } = useSelector((state: RootState) => state.adminTechnician);

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<AssignmentBatch | null>(null);

  useEffect(() => {
    dispatch(fetchAssignmentBatches());
  }, [dispatch]);

  const handleOpenViewModal = (batch: AssignmentBatch) => {
    setSelectedBatch(batch);
    setViewModalOpen(true);
  };
  
  const handleStartDistribution = async (batchId: string | undefined) => {
    if (!batchId) return;
    const toastId = toast.loading("Starting assignment distribution...");
    try {
        await dispatch(distributeAssignments(batchId)).unwrap();
        toast.success("Assignments have been distributed to all active users.", { id: toastId });
    } catch (error: any) {
        toast.error(error || "Failed to start distribution.", { id: toastId });
    }
  };

  const todaysDate = format(new Date(), 'yyyy-MM-dd');
  const todaysBatch = assignments.find((b) => b.date === todaysDate) || null;

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Assignment Management</h1>

        <Card className="rounded-lg">
          <CardHeader><CardTitle>Today's Assignment Status</CardTitle><CardDescription>Monitor and manage the assignment distribution for today.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-4"><Clock className="h-8 w-8 text-muted-foreground"/><div className="flex-1"><p className="text-sm text-muted-foreground">Status</p><Badge variant={todaysBatch?.status === "In Progress" ? "default" : "secondary"}>{todaysBatch?.status ?? "Not Uploaded"}</Badge></div></div>
              <div className="flex items-center gap-4"><Upload className="h-8 w-8 text-muted-foreground"/><div className="flex-1"><p className="text-sm text-muted-foreground">Links Prepared</p><p className="font-bold text-lg">{todaysBatch?.totalLinks ?? 0}</p></div></div>
              <div className="flex-1"><p className="text-sm text-muted-foreground mb-2">Overall Completion</p><Progress value={todaysBatch?.completionRate ?? 0} /><p className="font-bold text-sm text-right mt-2">{todaysBatch?.completionRate ?? 0}%</p></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setUploadModalOpen(true)} disabled={!!todaysBatch}><Upload className="mr-2 h-4 w-4" /> {todaysBatch ? 'Links Already Uploaded' : "Upload Today's Links"}</Button>
              <Button variant="secondary" onClick={() => handleStartDistribution(todaysBatch?._id)} disabled={!todaysBatch || todaysBatch.status !== "Pending"}><PlayCircle className="mr-2 h-4 w-4" /> Start Distribution</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader><CardTitle>Assignment Monitoring</CardTitle><CardDescription>View history of past assignment batches and their performance.</CardDescription></CardHeader>
          <CardContent> 
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Total Links</TableHead><TableHead>Completion</TableHead><TableHead className="text-center">Non-Compliant</TableHead></TableRow></TableHeader>
                <TableBody>
                  {status === 'loading' && <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading assignment history...</TableCell></TableRow>}
                  {assignments.map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell className="font-semibold">{format(new Date(batch.date), 'PP')}</TableCell>
                      <TableCell><Badge variant={batch.status === "Completed" ? "default" : batch.status === "In Progress" ? "outline" : "secondary"}><Clock className="mr-1 h-3 w-3" /> {batch.status}</Badge></TableCell>
                      <TableCell>{batch.totalLinks}</TableCell>
                      <TableCell><span className="font-mono">{batch.completionRate}%</span></TableCell>
                      <TableCell className="text-center"><Button variant="ghost" size="sm" onClick={() => handleOpenViewModal(batch)}><AlertTriangle className="mr-2 h-4 w-4 text-red-500" /> {batch.nonCompliantUsers || 0}</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <UploadLinksModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <ViewNonCompliantModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} batch={selectedBatch} />
    </>
  );
}