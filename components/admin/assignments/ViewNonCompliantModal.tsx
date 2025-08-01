"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type AssignmentBatch, type NonCompliantUser } from "@/lib/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchNonCompliantUsers } from "@/lib/redux/features/admin/technicianSlice";

interface ViewNonCompliantModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: AssignmentBatch | null;
}

export function ViewNonCompliantModal({
  isOpen,
  onClose,
  batch,
}: ViewNonCompliantModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { nonCompliantUsers, status } = useSelector(
    (state: RootState) => state.adminTechnician
  );

  useEffect(() => {
    if (isOpen && batch?._id) {
      dispatch(fetchNonCompliantUsers(batch._id));
    }
  }, [isOpen, batch, dispatch]);

  const renderContent = () => {
    if (status === "loading") {
      return <div className="py-4 text-center text-sm text-muted">Loading non-compliant users...</div>;
    }

    if (!nonCompliantUsers || nonCompliantUsers.length === 0) {
      return <div className="py-4 text-center text-sm text-muted">No non-compliant users found for this batch.</div>;
    }

    return (
      <div className="py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Failure Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonCompliantUsers.map((user) => {
              const { tasksAssigned, tasksCompleted } = user;
              const failureRate =
                tasksAssigned > 0
                  ? (((tasksAssigned - tasksCompleted) / tasksAssigned) * 100).toFixed(1)
                  : "0.0";

              return (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {tasksCompleted}/{tasksAssigned}
                  </TableCell>
                  <TableCell className="text-red-500 font-semibold">
                    {failureRate}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (!batch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Non-Compliant Users</DialogTitle>
          <DialogDescription>
            Users who didn’t complete all tasks for {batch.date}.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
