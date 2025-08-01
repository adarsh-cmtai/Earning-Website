"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ArrowRight, LifeBuoy, Mail, MessageCircle, Phone, Send, Video, Search, FileText, Bot, User, ChevronRight } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { createSupportTicket, fetchUserTickets } from "@/lib/redux/features/user/supportSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

declare global {
    interface Window {
      Tawk_API: any;
    }
}

export function SupportContent() {
  const [formData, setFormData] = useState({ subject: "", category: "", message: "" });
  const dispatch = useDispatch<AppDispatch>();
  const { tickets, status } = useSelector((state: RootState) => state.userSupport);

  useEffect(() => {
    if (status === 'idle') {
        dispatch(fetchUserTickets());
    }
  }, [status, dispatch]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.category || !formData.message) { toast.error("Please fill all required fields."); return; }
    
    const toastId = toast.loading("Submitting your ticket...");
    try {
        await dispatch(createSupportTicket(formData)).unwrap();
        toast.success("Your support ticket has been submitted!", { id: toastId, description: "Our team will get back to you shortly." });
        setFormData({ subject: "", category: "", message: "" });
    } catch (error: any) {
        toast.error(error.message || "Failed to submit ticket.", { id: toastId });
    }
  };

  const handleStartChat = () => {
    if (window.Tawk_API && window.Tawk_API.toggle) {
        window.Tawk_API.toggle();
    } else {
        toast.error("Live chat is currently unavailable. Please try again shortly.");
    }
  };

  return (
    <div className="space-y-12 p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-4 py-16 rounded-xl bg-white dark:bg-black bg-[url('/grid.svg')] dark:bg-[url('/grid-dark.svg')] bg-cover bg-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">We're here to help.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Search our knowledge base or contact our world-class support team.</p>
        <div className="relative max-w-xl mx-auto"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Search articles..." className="h-12 pl-12 text-base rounded-full shadow-sm" /></div>
      </div>
      
      <Tabs defaultValue="submit">
        <TabsList className="grid w-full grid-cols-2 h-auto"><TabsTrigger value="submit">Contact Support</TabsTrigger><TabsTrigger value="history">My Tickets</TabsTrigger></TabsList>
        <TabsContent value="submit" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="h-full"><CardHeader><CardTitle className="text-2xl">Submit a Support Request</CardTitle><CardDescription>This is the best way to get a detailed response for specific issues.</CardDescription></CardHeader>
                    <form onSubmit={handleSubmitTicket}>
                        <CardContent className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6"><div className="space-y-1.5"><Label htmlFor="ticketSubject">Subject</Label><Input id="ticketSubject" placeholder="e.g., Payment not received" value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} required /></div><div className="space-y-1.5"><Label htmlFor="ticketCategory">Category</Label><Select value={formData.category} onValueChange={(value) => setFormData(p => ({ ...p, category: value }))} required><SelectTrigger id="ticketCategory"><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent><SelectItem value="payment">Payment Issues</SelectItem><SelectItem value="assignment">Assignment Help</SelectItem><SelectItem value="ai-video">AI Video Problems</SelectItem><SelectItem value="referral">Referral & Downline</SelectItem><SelectItem value="account">Account Access</SelectItem><SelectItem value="technical">Technical Glitches</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div></div>
                            <div className="space-y-1.5"><Label htmlFor="ticketMessage">Message</Label><Textarea id="ticketMessage" placeholder="Please provide a detailed description of your issue..." value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} className="min-h-[150px]" required/></div>
                        </CardContent>
                        <CardFooter className="border-t pt-6"><Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>{status === 'loading' ? 'Submitting...' : <><Send className="mr-2 h-4 w-4" />Send Request</>}</Button></CardFooter>
                    </form>
                  </Card>
                </div>
                <aside className="lg:col-span-1 space-y-6">
                    <Card className="border-green-500/30 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex-row gap-4 items-center"><MessageCircle className="h-8 w-8 text-green-500"/><CardTitle>Live Chat</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground text-sm">For instant answers from our support team. Available 24/7.</p></CardContent>
                        <CardFooter><Button className="w-full" variant="outline" onClick={handleStartChat}>Start Chat</Button></CardFooter>
                    </Card>
                    <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com'}`}>
                        <Card className="border-blue-500/30 hover:shadow-lg transition-shadow"><CardHeader className="flex-row gap-4 items-center"><Mail className="h-8 w-8 text-blue-500"/><CardTitle>Email Us</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">Best for non-urgent, detailed questions. We'll reply within 4 hours.</p></CardContent><CardFooter><Button className="w-full" variant="outline">Send an Email</Button></CardFooter></Card>
                    </a>
                </aside>
            </div>
        </TabsContent>
        <TabsContent value="history" className="mt-8">
            <Card>
                <CardHeader><CardTitle>My Support Tickets</CardTitle><CardDescription>Here is a history of your communication with our support team.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {tickets.map(ticket => (
                        <Collapsible key={ticket._id} className="border rounded-lg">
                            <CollapsibleTrigger className="w-full p-4 flex justify-between items-center hover:bg-muted/50">
                                <div><p className="font-semibold text-left">{ticket.subject}</p><p className="text-xs text-left text-muted-foreground">Category: {ticket.category} | Submitted: {format(new Date(ticket.createdAt), 'PP')}</p></div>
                                <div className="flex items-center gap-2"><Badge variant={ticket.status === 'Open' ? 'destructive' : 'default'}>{ticket.status}</Badge><ChevronRight className="h-4 w-4" /></div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 border-t bg-muted/50">
                                <div className="flex items-start gap-3 mb-4"><div className="p-2 rounded-full bg-background"><User className="h-4 w-4"/></div><div><p className="font-semibold text-sm">Your Message</p><p className="text-sm text-muted-foreground">{ticket.message}</p></div></div>
                                {ticket.responses.map(res => (
                                    <div key={res._id} className="flex items-start gap-3 ml-8 border-t pt-4 mt-4"><div className="p-2 rounded-full bg-primary text-primary-foreground"><Bot className="h-4 w-4"/></div><div><p className="font-semibold text-sm">{res.responder.fullName} (Support Team)</p><p className="text-sm text-muted-foreground">{res.message}</p></div></div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}