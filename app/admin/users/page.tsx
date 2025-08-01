"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ShieldX, Edit, KeyRound, FileClock, Youtube, CheckCircle, XCircle, Users, ShieldCheck } from "lucide-react";
import { SuspendUserModal } from "@/components/admin/users/SuspendUserModal";
import { EditUserDetailsModal } from "@/components/admin/users/EditUserDetailsModal";
import { ResetPasswordModal } from "@/components/admin/users/ResetPasswordModal";
import { ViewComplianceModal } from "@/components/admin/users/ViewComplianceModal";
import { ApproveYoutubeModal } from "@/components/admin/users/ApproveYoutubeModal";
import { UserDetailPanel } from "@/components/admin/users/UserDetailPanel";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUsers } from "@/lib/redux/features/admin/usersSlice";
import { type User } from "@/lib/types";
import { UserSearchBar } from "@/components/admin/users/UserSearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";

type ModalType = "suspend" | "edit" | "resetPassword" | "compliance" | "youtube" | "detail";

const TableSkeleton = () => (
  [...Array(8)].map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
    </TableRow>
  ))
);

const UserDetailModal = ({ user, isOpen, onClose }: { user: User | null; isOpen: boolean; onClose: () => void; }) => {
  if (!isOpen || !user) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>User Profile Details</DialogTitle>
          <DialogDescription>Detailed view of the user's profile and activities.</DialogDescription>
        </DialogHeader>
        <UserDetailPanel userId={user._id} />
      </DialogContent>
    </Dialog>
  );
};

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status } = useSelector((state: RootState) => state.adminUsers);
  
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchUsers({ search: debouncedSearchTerm, status: statusFilter }));
  }, [debouncedSearchTerm, statusFilter, dispatch]);

  const handleOpenModal = (type: ModalType, user: User) => {
    setSelectedUser(user);
    setModalOpen(type);
  };

  const handleCloseModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
  };
  
  const getYoutubeBadge = (status: User["youtubeStatus"]) => {
    switch (status) {
      case "Verified": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
      case "Pending": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Pending</Badge>;
      case "Declined": return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"><XCircle className="mr-1 h-3 w-3" />Declined</Badge>;
      default: return <Badge variant="outline">Not Linked</Badge>;
    }
  };
  
  const getAccountStatusBadge = (status: User["status"]) => {
    switch (status) {
        case "Approved": return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Approved</Badge>;
        case "Suspended": return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Suspended</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const activeUsers = useMemo(() => users.filter(u => u.status === 'Approved').length, [users]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Search, manage, and take action on all user accounts.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><h3 className="text-sm font-medium">Total Users</h3><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><h3 className="text-sm font-medium">Active Users</h3><ShieldCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{activeUsers}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <UserSearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm} 
              onStatusChange={setStatusFilter} 
            />
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[250px]">User</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead>Social Media Status</TableHead>
                        <TableHead>Account Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {status === 'loading' && <TableSkeleton />}
                    {status === 'succeeded' && users.length > 0 && users.map((user: User) => (
                    <TableRow key={user._id}>
                        <TableCell 
                          className="cursor-pointer font-medium"
                          onClick={() => handleOpenModal("detail", user)}
                        >
                            <div className="flex items-center gap-3">
                                <Avatar><AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} /><AvatarFallback>{user.fullName?.charAt(0) ?? 'U'}</AvatarFallback></Avatar>
                                <div>
                                    <div>{user.fullName || 'N/A'}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell"><div className="text-sm">{user.mobile}</div></TableCell>
                        <TableCell>{getYoutubeBadge(user.youtubeStatus ?? 'Not Linked')}</TableCell>
                        <TableCell>{getAccountStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleOpenModal("youtube", user)}><Youtube className="mr-2 h-4 w-4" /> Social Media Channel</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenModal("suspend", user)}><ShieldX className="mr-2 h-4 w-4" /> Suspend/Activate</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenModal("compliance", user)}><FileClock className="mr-2 h-4 w-4" /> View Compliance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => handleOpenModal("edit", user)}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenModal("resetPassword", user)}><KeyRound className="mr-2 h-4 w-4" /> Reset Password</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                    {status === 'succeeded' && users.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center h-24">No users found for the current filter.</TableCell></TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedUser && (
        <>
          <UserDetailModal user={selectedUser} isOpen={modalOpen === "detail"} onClose={handleCloseModal} />
          <ApproveYoutubeModal user={selectedUser} isOpen={modalOpen === "youtube"} onClose={handleCloseModal} />
          <SuspendUserModal user={selectedUser} isOpen={modalOpen === "suspend"} onClose={handleCloseModal} />
          <ViewComplianceModal user={selectedUser} isOpen={modalOpen === "compliance"} onClose={handleCloseModal} />
          <EditUserDetailsModal user={selectedUser} isOpen={modalOpen === "edit"} onClose={handleCloseModal} />
          <ResetPasswordModal user={selectedUser} isOpen={modalOpen === "resetPassword"} onClose={handleCloseModal} />
        </>
      )}
    </>
  );
}