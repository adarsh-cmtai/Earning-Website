import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type AiVideo } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface VideoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: AiVideo | null;
  onDelete: (video: AiVideo) => void;
}

export function VideoDetailsModal({
  isOpen,
  onClose,
  video,
  onDelete,
}: VideoDetailsModalProps) {
  if (!video) return null;

  const handleDeleteClick = () => {
    onClose();
    onDelete(video);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
          <DialogDescription>
            Uploaded on {format(new Date(video.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="bg-slate-900 rounded-lg aspect-video">
            <video
              src={video.fileUrl}
              controls
              className="w-full h-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Video Details</h3>
            <div className="text-sm space-y-2">
              <p><strong>Topic:</strong>{" "}<Badge variant="secondary">{video.topic}</Badge></p>
              <p><strong>Type:</strong>{" "}<Badge variant="secondary">{video.type}</Badge></p>
              <p><strong>Status:</strong> <Badge>{video.status}</Badge></p>
              <p><strong>Assigned To:</strong>{" "}{video.assignedTo || "Not Assigned"}</p>
            </div>
            <div className="border-t pt-4">
              <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Video
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}