"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAiVideosData, markVideoAsDownloaded } from "@/lib/redux/features/user/aiVideosSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Play, Calendar, Clock, Tag, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from 'date-fns';
import Link from "next/link";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";

export function AIVideosContent() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    assignedVideo,
    availableVideos,
    videoHistory,
    channelName,
    canDownload,
    status
  } = useSelector((state: RootState) => state.userAiVideos);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAiVideosData());
  }, [dispatch]);

  const handleDownload = (video: any) => {
    setDownloadingId(video._id);
    toast.info("Your download will begin shortly...");
    
    setTimeout(async () => {
      try {
        window.open(video.fileUrl, '_blank');
        await dispatch(markVideoAsDownloaded(video._id)).unwrap();
        toast.success("Video status updated to 'Downloaded'!");
      } catch (error: any) {
        toast.error(error || "Failed to update video status.");
      } finally {
        setDownloadingId(null);
      }
    }, 2000);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  if (status === 'loading' || status === 'idle') return <FullScreenLoader />;

  const renderVideoCard = (video: any, label: string = "Available") => (
    <Card key={video._id} className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{video.title}</span>
          <Badge variant="outline" className="capitalize bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-4 w-4" />
            {label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative group">
              <div className="w-full h-64 bg-slate-900 rounded-lg">
                <video src={video.fileUrl} controls className="w-full h-full rounded-lg object-cover" />
              </div>
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-black/70 text-white">{video.type}</Badge>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(video.createdAt), 'PPP')}</span>
              </div>
              <Badge variant="outline">{video.type}</Badge>
              <Badge variant="outline">
                <Tag className="mr-1 h-3 w-3" />
                {video.topic}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Suggested Title</Label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(video.title, "Title")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm border">{video.title}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Suggested Description</Label>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(video.description, "Description")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm max-h-24 overflow-y-auto border">{video.description}</div>
              </div>

              <div>
                <Label>Your Channel Name</Label>
                <div className="mt-1 p-2 bg-muted rounded text-sm border">{channelName}</div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Button
                onClick={() => handleDownload(video)}
                disabled={!canDownload || downloadingId !== null}
                className="w-full py-3 text-base font-semibold"
              >
                {downloadingId === video._id ? (
                  <>
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download AI Video
                  </>
                )}
              </Button>
              {/* <Button variant="outline" className="w-full" asChild>
                <a href="/tutorials/upload-guide" target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Quick Upload Guide
                </a>
              </Button> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">AI Video Downloads</h1>
        <p className="text-muted-foreground text-lg">
          Download your personalized AI videos to grow your Social Media channel.
        </p>
      </div>

      {!canDownload && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold">Downloads Locked</AlertTitle>
          <AlertDescription>
            You must complete all pending daily assignments before you can download new videos.
            <Button asChild variant="link" className="p-0 h-auto ml-2">
              <Link href="/assignments">Go to Assignments</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {assignedVideo && renderVideoCard(assignedVideo, "Assigned")}

      {availableVideos.length > 0
        ? availableVideos.map((video) => renderVideoCard(video))
        : !assignedVideo && (
            <Card className="rounded-lg text-center p-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No Videos Available</h3>
              <p>There are currently no new AI videos matching your topic. Please check back later.</p>
            </Card>
          )}
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Download History</CardTitle>
          <CardDescription>A list of AI videos you have previously downloaded.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoHistory.map((video) => (
              <Card key={video._id} className="hover:border-primary/50 transition-colors rounded-lg">
                <div className="relative mb-3">
                  <div className="w-full h-32 bg-slate-900 rounded-t-lg">
                    <video src={video.fileUrl} className="w-full h-full rounded-t-lg object-cover" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="capitalize">
                      Downloaded
                    </Badge>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{video.topic}</span>
                    <span>{format(new Date(video.createdAt), 'PP')}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={video.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-3 w-3" />
                      Re-download
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
