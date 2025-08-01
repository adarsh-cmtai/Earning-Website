"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchTickets } from "@/lib/redux/features/admin/supportSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Inbox } from "lucide-react";
import { type SupportTicket } from "@/lib/types";
import { TicketDetailModal } from "@/components/admin/support/TicketDetailModal";
import { format } from "date-fns";

export default function SupportPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tickets, status } = useSelector((state: RootState) => state.adminSupport);
    const [filterStatus, setFilterStatus] = useState("Open");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchTickets(filterStatus));
    }, [dispatch, filterStatus]);
    
    const handleOpenModal = (ticketId: string) => {
        setSelectedTicketId(ticketId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTicketId(null);
        dispatch(fetchTickets(filterStatus));
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
                    <p className="text-muted-foreground">Manage and respond to user support tickets.</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div><CardTitle>Support Tickets</CardTitle><CardDescription>Showing {filterStatus.toLowerCase()} tickets.</CardDescription></div>
                            <Tabs defaultValue="Open" onValueChange={setFilterStatus}>
                                <TabsList><TabsTrigger value="Open">Open</TabsTrigger><TabsTrigger value="Answered">Answered</TabsTrigger><TabsTrigger value="Closed">Closed</TabsTrigger></TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {status === 'loading' && <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading tickets...</TableCell></TableRow>}
                                {status !== 'loading' && tickets.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground"><Inbox className="mx-auto h-8 w-8 mb-2" />No {filterStatus.toLowerCase()} tickets found.</TableCell></TableRow>}
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket._id}>
                                        <TableCell><div className="font-medium">{ticket.user?.fullName || 'Deleted User'}</div><div className="text-sm text-muted-foreground">{ticket.user?.email || 'N/A'}</div></TableCell>
                                        <TableCell className="max-w-xs truncate">{ticket.subject}</TableCell>
                                        <TableCell><Badge variant="outline">{ticket.category}</Badge></TableCell>
                                        <TableCell>{format(new Date(ticket.createdAt), 'PP')}</TableCell>
                                        <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleOpenModal(ticket._id)}><Eye className="mr-2 h-4 w-4" />View Ticket</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <TicketDetailModal isOpen={isModalOpen} onClose={handleCloseModal} ticketId={selectedTicketId} />
        </>
    );
}