"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAiVideos, deleteAiVideo, allocateAiVideos } from "@/lib/redux/features/admin/technicianSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, MoreHorizontal, Video, Check, Clock, Users, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type AiVideo } from "@/lib/types";
import { UploadAiVideoModal } from "@/components/admin/ai-videos/UploadAiVideoModal";
import { VideoDetailsModal } from "@/components/admin/ai-videos/VideoDetailsModal";
import { DeleteConfirmationModal } from "@/components/admin/content/DeleteConfirmationModal";
import { toast } from "sonner";
import { format } from 'date-fns';

export default function AiVideosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, status } = useSelector((state: RootState) => state.adminTechnician);
  
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<AiVideo | null>(null);

  useEffect(() => {
    dispatch(fetchAiVideos());
  }, [dispatch]);

  const handleOpenDetailsModal = (video: AiVideo) => { setSelectedVideo(video); setDetailsModalOpen(true); };
  const handleOpenDeleteModal = (video: AiVideo) => { setSelectedVideo(video); setDeleteModalOpen(true); };
  
  const handleDeleteConfirm = async () => {
    if (!selectedVideo) return;
    const toastId = toast.loading("Deleting video...");
    try {
        await dispatch(deleteAiVideo(selectedVideo._id)).unwrap();
        toast.success("Video deleted successfully.", { id: toastId });
        setDeleteModalOpen(false);
        setSelectedVideo(null);
    } catch (error: any) {
        toast.error(error || "Failed to delete video.", { id: toastId });
    }
  };
  
  const handleAllocate = async () => {
    const toastId = toast.loading("Starting video allocation process...");
    try {
        const result = await dispatch(allocateAiVideos()).unwrap();
        toast.success(result.message || `${result.data.allocationCount} videos allocated.`, { id: toastId });
    } catch (error: any) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
        toast.error(errorMessage || "Allocation failed.", { id: toastId });
    }
  };

  const availableVideos = videos.filter((v) => v.status === "Available").length;
  const assignedVideos = videos.length - availableVideos;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Video Management</h1>
                <p className="text-muted-foreground">Upload and allocate AI-generated videos to users.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => setUploadModalOpen(true)}><Upload className="mr-2 h-4 w-4" /> Upload Video</Button>
                <Button variant="secondary" onClick={handleAllocate}><PlayCircle className="mr-2 h-4 w-4" /> Start Allocation</Button>
            </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-lg"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Videos</CardTitle><Video className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{videos.length}</div></CardContent></Card>
          <Card className="rounded-lg"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Available</CardTitle><Check className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{availableVideos}</div></CardContent></Card>
          <Card className="rounded-lg"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Assigned</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{assignedVideos}</div></CardContent></Card>
          <Card className="rounded-lg"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Eligible Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">...</div></CardContent></Card>
        </div>

        <Card className="rounded-lg">
          <CardHeader><CardTitle>AI Video Library</CardTitle><CardDescription>The central repository of all AI-generated videos.</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Video Title</TableHead><TableHead className="hidden sm:table-cell">Uploaded</TableHead><TableHead>Topic</TableHead><TableHead>Status</TableHead><TableHead className="hidden md:table-cell">Assigned To</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {status === 'loading' && <TableRow><TableCell colSpan={6} className="text-center h-24">Loading videos...</TableCell></TableRow>}
                  {status === 'succeeded' && videos.map((video) => (
                    <TableRow key={video._id}>
                      <TableCell className="font-medium">{video.title}<div className="text-xs text-muted-foreground">{video.type}</div></TableCell>
                      <TableCell className="hidden sm:table-cell">{format(new Date(video.createdAt), 'PP')}</TableCell>
                      <TableCell><Badge variant="outline">{video.topic}</Badge></TableCell>
                      <TableCell><Badge variant={video.status === 'Available' ? 'secondary' : 'default'}>{video.status}</Badge></TableCell>
                      <TableCell className="hidden md:table-cell">{video.assignedTo || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleOpenDetailsModal(video)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onSelect={() => handleOpenDeleteModal(video)}>Delete Video</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <UploadAiVideoModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <VideoDetailsModal isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} video={selectedVideo} onDelete={handleOpenDeleteModal} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} itemName={`the video "${selectedVideo?.title}"`} />
    </>
  );
}