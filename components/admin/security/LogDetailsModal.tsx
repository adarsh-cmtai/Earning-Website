"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  logData: object | string | null;
}

export function LogDetailsModal({
  isOpen,
  onClose,
  title,
  logData,
}: LogDetailsModalProps) {
  if (!logData) return null;

  const formattedData =
    typeof logData === "object" ? JSON.stringify(logData, null, 2) : logData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This is the raw data associated with the log entry.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <pre className="bg-slate-900 text-white p-4 rounded-md text-xs overflow-x-auto max-h-[50vh]">
            <code>{formattedData}</code>
          </pre>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
