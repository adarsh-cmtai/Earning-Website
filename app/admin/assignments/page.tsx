"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUsers } from "@/lib/redux/features/admin/usersSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ListVideo } from "lucide-react";
import { type User as UserType } from "@/lib/types";
import { AssignLinksModal } from "@/components/admin/assignments/AssignLinksModal";
import { useDebounce } from "@/hooks/useDebounce";

export default function AssignmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status } = useSelector((state: RootState) => state.adminUsers);

  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchUsers({ search: debouncedSearchTerm, youtubeStatus: 'Verified' }));
  }, [dispatch, debouncedSearchTerm]);

  const handleOpenAssignModal = (user: UserType) => {
    setSelectedUser(user);
    setAssignModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Assignment Management</h1>
                <p className="text-muted-foreground">Select a user to assign or update their daily video links.</p>
            </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div><CardTitle>Select a User</CardTitle><CardDescription>Showing all users with a verified Social Media channel.</CardDescription></div>
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
            </div>
          </CardHeader>
          <CardContent> 
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {status === 'loading' && <TableRow><TableCell colSpan={3} className="h-24 text-center">Loading users...</TableCell></TableRow>}
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-semibold">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleOpenAssignModal(user)}><ListVideo className="mr-2 h-4 w-4"/>Assign Links</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AssignLinksModal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} user={selectedUser} />
    </>
  );
}
