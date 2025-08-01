"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchSubmissions } from "@/lib/redux/features/admin/incomeVerificationSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileSearch } from "lucide-react";
import { type ManualIncomeSubmission } from "@/lib/types";
import { ReviewIncomeModal } from "@/components/admin/income-verification/ReviewIncomeModal";
import { format } from 'date-fns';

export default function IncomeVerificationPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { submissions, status } = useSelector((state: RootState) => state.adminIncomeVerification);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<ManualIncomeSubmission | null>(null);

    useEffect(() => {
        dispatch(fetchSubmissions());
    }, [dispatch]);

    const handleOpenModal = (submission: ManualIncomeSubmission) => {
        setSelectedSubmission(submission);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSubmission(null);
        dispatch(fetchSubmissions());
    };
    
    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manual Income Verification</h1>
                    <p className="text-muted-foreground">Review and approve or decline user-submitted monthly income reports.</p>
                </div>

                <Card>
                    <CardHeader><CardTitle>Pending Submissions</CardTitle><CardDescription>There are {submissions.length} income reports awaiting review.</CardDescription></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Period</TableHead><TableHead>Amount</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {status === 'loading' && <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading submissions...</TableCell></TableRow>}
                                    {status !== 'loading' && submissions.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground"><FileSearch className="mx-auto h-8 w-8 mb-2" />No pending submissions.</TableCell></TableRow>}
                                    {submissions.map((sub) => (
                                        <TableRow key={sub._id}>
                                            <TableCell><div className="font-medium">{sub.user.fullName}</div><div className="text-sm text-muted-foreground">{sub.user.email}</div></TableCell>
                                            <TableCell>{sub.month} {sub.year}</TableCell>
                                            <TableCell className="font-semibold">₹{sub.amount.toLocaleString()}</TableCell>
                                            <TableCell>{format(new Date(sub.createdAt), 'PP')}</TableCell>
                                            <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleOpenModal(sub)}><Eye className="mr-2 h-4 w-4" />Review</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ReviewIncomeModal isOpen={isModalOpen} onClose={handleCloseModal} submission={selectedSubmission} />
        </>
    );
}