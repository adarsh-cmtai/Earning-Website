"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchIncomeProfiles, markAsPaid } from "@/lib/redux/features/admin/financeSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Wallet, Banknote, AlertCircle, Ban, Search, CheckCircle, Percent, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type UserIncomeProfile } from "@/lib/types";
import { BulkPayoutModal } from "@/components/admin/income/BulkPayoutModal";
import { SuspendIncomeModal } from "@/components/admin/income/SuspendIncomeModal";
import { SetContributionModal } from "@/components/admin/income/SetContributionModal";
import { SendAlertModal } from "@/components/admin/income/SendAlertModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeletonRow = () => (
    <TableRow>
        <TableCell className="w-[50px]"><Skeleton className="h-5 w-5" /></TableCell>
        <TableCell>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell className="w-[80px] text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
    </TableRow>
);

export default function IncomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const { profiles: userIncomes, status } = useSelector((state: RootState) => state.adminFinance);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [modalState, setModalState] = useState<{ type: 'payout' | 'suspend' | 'contribution' | 'alert' | null, user: UserIncomeProfile | null }>({ type: null, user: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState("payouts");

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        dispatch(fetchIncomeProfiles({ search: debouncedSearchTerm, contributionStatus: activeTab === 'contributions' ? 'all' : undefined }));
    }, [dispatch, debouncedSearchTerm, activeTab]);

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleSelectAll = (checked: boolean | "indeterminate") => {
        setSelectedUsers(checked === true ? userIncomes.map(u => u._id) : []);
    };

    const openModal = (type: 'payout' | 'suspend' | 'contribution' | 'alert', user?: UserIncomeProfile) => {
        setModalState({ type, user: user || null });
    };

    const closeModal = () => setModalState({ type: null, user: null });

    const handleMarkAsPaid = async (user: UserIncomeProfile) => {
        const toastId = toast.loading(`Processing payment for ${user.fullName}...`);
        try {
            await dispatch(markAsPaid(user._id)).unwrap();
            toast.success("Contribution status updated successfully.", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Failed to update status.", { id: toastId });
        }
    };
    
    const summaryStats = useMemo(() => {
        return {
            totalPending: userIncomes.reduce((sum, u) => sum + u.pendingPayout, 0),
            contributionsDue: userIncomes.filter(u => u.contributionStatus !== "Paid").length,
            incomeSuspended: userIncomes.filter(u => u.incomeStatus === "Suspended").length
        };
    }, [userIncomes]);

    const selectedPayoutTotal = useMemo(() =>
        userIncomes.filter(u => selectedUsers.includes(u._id)).reduce((sum, u) => sum + u.pendingPayout, 0),
        [userIncomes, selectedUsers]
    );

    const isAllSelected = userIncomes.length > 0 && selectedUsers.length === userIncomes.length;
    const isSomeSelected = selectedUsers.length > 0 && !isAllSelected;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Paid":
            case "Active":
                return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">● {status}</Badge>;
            case "Pending":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">● {status}</Badge>;
            case "Overdue":
            case "Suspended":
                return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">● {status}</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <main className="flex flex-1 flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Income & Finance</h1>
                        <p className="text-muted-foreground">Manage user payouts and contribution compliance.</p>
                    </div>
                    {activeTab === 'payouts' && (
                        <Button onClick={() => openModal('payout')} disabled={selectedUsers.length === 0} className="w-full sm:w-auto">
                            Process Payout ({selectedUsers.length})
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Pending Payouts</CardTitle><Wallet className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{summaryStats.totalPending.toLocaleString()}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Contributions Due</CardTitle><Banknote className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.contributionsDue} Users</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Income Suspended</CardTitle><AlertCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryStats.incomeSuspended}</div></CardContent></Card>
                </div>

                <Card>
                    <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedUsers([]); setSearchTerm(''); }}>
                        <CardHeader className="p-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b p-4">
                                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                                    <TabsTrigger value="payouts">Payouts</TabsTrigger>
                                    <TabsTrigger value="contributions">Contributions</TabsTrigger>
                                </TabsList>
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search user..." className="pl-8 w-full sm:w-[250px] lg:w-[300px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                        </CardHeader>

                        <TabsContent value="payouts" className="mt-0">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]"><Checkbox checked={isSomeSelected ? 'indeterminate' : isAllSelected} onCheckedChange={handleSelectAll} /></TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead className="text-right">Total Earnings</TableHead>
                                                <TableHead className="text-right">Pending Payout</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {status === 'loading' && [...Array(5)].map((_, i) => <TableSkeletonRow key={i} />)}
                                            {status === 'succeeded' && userIncomes.map((user) => (
                                                <TableRow key={user._id} data-state={selectedUsers.includes(user._id) ? "selected" : undefined}>
                                                    <TableCell><Checkbox checked={selectedUsers.includes(user._id)} onCheckedChange={() => handleSelectUser(user._id)} /></TableCell>
                                                    <TableCell><div className="font-medium">{user.fullName}</div><div className="text-sm text-muted-foreground">{user.email}</div></TableCell>
                                                    <TableCell className="text-right">₹{user.totalEarnings.toLocaleString()}</TableCell>
                                                    <TableCell className="font-semibold text-right">₹{user.pendingPayout.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                            {status === 'succeeded' && userIncomes.length === 0 && <TableRow><TableCell colSpan={4} className="h-24 text-center">No users found.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="contributions" className="mt-0">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Contribution</TableHead>
                                                <TableHead className="hidden md:table-cell">Suggested %</TableHead>
                                                <TableHead>Income Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {status === 'loading' && [...Array(5)].map((_, i) => <TableSkeletonRow key={i} />)}
                                            {status === 'succeeded' && userIncomes.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell><div className="font-medium">{user.fullName}</div><div className="text-sm text-muted-foreground">{user.email}</div></TableCell>
                                                    <TableCell>{getStatusBadge(user.contributionStatus)}</TableCell>
                                                    <TableCell className="font-semibold hidden md:table-cell">{user.suggestedContributionPercentage}%</TableCell>
                                                    <TableCell>{getStatusBadge(user.incomeStatus)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onSelect={() => handleMarkAsPaid(user)} disabled={user.contributionStatus === 'Paid'}><CheckCircle className="mr-2 h-4 w-4" />Mark as Paid</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => openModal('contribution', user)}><Percent className="mr-2 h-4 w-4" />Set Suggested %</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onSelect={() => openModal('alert', user)}><AlertTriangle className="mr-2 h-4 w-4" />Send Due Alert</DropdownMenuItem>
                                                                <DropdownMenuItem onSelect={() => openModal('suspend', user)} className="text-destructive focus:text-destructive"><Ban className="mr-2 h-4 w-4" />Suspend/Reactivate</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {status === 'succeeded' && userIncomes.length === 0 && <TableRow><TableCell colSpan={5} className="h-24 text-center">No users found.</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </main>

            <BulkPayoutModal isOpen={modalState.type === 'payout'} onClose={closeModal} selectedUsers={selectedUsers} totalAmount={selectedPayoutTotal} />
            <SuspendIncomeModal isOpen={modalState.type === 'suspend'} onClose={closeModal} user={modalState.user} />
            <SetContributionModal isOpen={modalState.type === 'contribution'} onClose={closeModal} user={modalState.user} />
            <SendAlertModal isOpen={modalState.type === 'alert'} onClose={closeModal} user={modalState.user} />
        </>
    );
}