"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchTicketById, addTicketResponse } from "@/lib/redux/features/admin/supportSlice";
import { toast } from "sonner";
import { Send, User, Bot } from "lucide-react";
import { format } from "date-fns";

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | null;
}

export function TicketDetailModal({ isOpen, onClose, ticketId }: TicketDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTicket: ticket, status } = useSelector((state: RootState) => state.adminSupport);
  const [response, setResponse] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ticketId && isOpen) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [ticketId, isOpen, dispatch]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [ticket]);

  const handleSendResponse = async () => {
    if (!response.trim() || !ticketId) return;
    const toastId = toast.loading("Sending response...");
    try {
        await dispatch(addTicketResponse({ ticketId, message: response })).unwrap();
        toast.success("Response sent successfully.", { id: toastId });
        setResponse("");
    } catch (error: any) {
        toast.error(error.message || "Failed to send response.", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
          <DialogDescription>
            {ticket ? `Viewing ticket #${ticket._id.slice(-6)} from ${ticket.user?.email || 'N/A'}` : "Loading..."}
          </DialogDescription>
        </DialogHeader>
        {ticket ? (
        <div className="grid grid-cols-3 gap-6 py-4">
            <div className="col-span-1 space-y-4">
                <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Ticket Info</h4>
                    <div className="text-xs space-y-1 text-muted-foreground">
                        <p><strong>Status:</strong> <Badge variant={ticket.status === 'Open' ? 'destructive' : 'default'}>{ticket.status}</Badge></p>
                        <p><strong>Category:</strong> {ticket.category}</p>
                        <p><strong>Submitted:</strong> {format(new Date(ticket.createdAt), 'PPp')}</p>
                    </div>
                </div>
                <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">User</h4>
                    <p className="text-xs font-medium">{ticket.user?.fullName || 'Deleted User'}</p>
                    <p className="text-xs text-muted-foreground">{ticket.user?.email || 'N/A'}</p>
                </div>
            </div>
            <div className="col-span-2 flex flex-col h-[60vh]">
                <h3 className="font-semibold text-base mb-2">{ticket.subject}</h3>
                <ScrollArea className="flex-1 border rounded-lg p-2 bg-muted/50" ref={scrollAreaRef}>
                    <div className="p-2 space-y-4">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>
                            <div><p className="text-sm font-medium">{ticket.user?.fullName || 'Deleted User'}</p><div className="bg-background rounded-lg p-3 mt-1 text-sm">{ticket.message}</div><p className="text-xs text-muted-foreground mt-1">{format(new Date(ticket.createdAt), 'p')}</p></div>
                        </div>
                        {ticket.responses.map(res => (
                            <div key={res._id} className="flex items-start gap-3 justify-end">
                                <div className="text-right">
                                    <p className="text-sm font-medium">{res.responder.fullName} (Admin)</p>
                                    <div className="bg-primary text-primary-foreground rounded-lg p-3 mt-1 text-sm">{res.message}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(res.createdAt), 'p')}</p>
                                </div>
                                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-4 flex gap-2">
                    <Textarea placeholder="Type your response here..." value={response} onChange={(e) => setResponse(e.target.value)} />
                    <Button onClick={handleSendResponse} disabled={!response.trim()}><Send className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
        ) : <div className="h-64 flex items-center justify-center">Loading ticket details...</div>}
        <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}