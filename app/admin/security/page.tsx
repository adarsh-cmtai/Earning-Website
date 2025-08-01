"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchAuditLogs, fetchErrorLogs } from "@/lib/redux/features/admin/securitySlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Eye } from "lucide-react";
import { LogDetailsModal } from "@/components/admin/security/LogDetailsModal";
import { format } from "date-fns";

export default function SecurityPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs, errorLogs, status } = useSelector((state: RootState) => state.adminSecurity);
  
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; data: object | string | null; }>({ isOpen: false, title: "", data: null });

  useEffect(() => {
    dispatch(fetchAuditLogs());
    dispatch(fetchErrorLogs());
  }, [dispatch]);

  const openLogDetails = (title: string, data: object | string | null) => {
    setModalState({ isOpen: true, title, data });
  };

  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Security & Logging</h1>
        <Tabs defaultValue="audit">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="audit">Audit Trails</TabsTrigger><TabsTrigger value="errors">Error Logs</TabsTrigger></TabsList>

          <TabsContent value="audit" className="space-y-4 mt-6">
            <Card><CardHeader><CardTitle>Admin Action Logs</CardTitle><CardDescription>Detailed records of administrative actions.</CardDescription></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-4"><Input placeholder="Filter by admin, user, or action..." className="w-full sm:max-w-sm" /><Button variant="outline" className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4" /> Apply Filter</Button></div>
                <div className="overflow-x-auto">
                    <Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Admin</TableHead><TableHead>Action</TableHead><TableHead>Details</TableHead><TableHead className="text-right">View Raw</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {status === 'loading' && <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading audit logs...</TableCell></TableRow>}
                        {auditLogs.map((log) => (
                        <TableRow key={log._id}>
                            <TableCell>{format(new Date(log.createdAt), "PPP p")}</TableCell>
                            <TableCell>{log.adminEmail}</TableCell>
                            <TableCell><Badge variant="secondary">{log.actionType}</Badge></TableCell>
                            <TableCell>{log.details}</TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => openLogDetails(`Audit Log: ${log._id}`, log.rawData)}><Eye className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4 mt-6">
            <Card><CardHeader><CardTitle>System Error Logs</CardTitle><CardDescription>Comprehensive logs for developers to diagnose issues.</CardDescription></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-4"><Input placeholder="Filter by error code or message..." className="w-full sm:max-w-sm" /><Button variant="outline" className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4" /> Apply Filter</Button></div>
                <div className="overflow-x-auto">
                    <Table><TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Code</TableHead><TableHead>Error Message</TableHead><TableHead className="text-right">View Stack</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {status === 'loading' && <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading error logs...</TableCell></TableRow>}
                        {errorLogs.map((log) => (
                        <TableRow key={log._id}>
                            <TableCell>{format(new Date(log.createdAt), "PPP p")}</TableCell>
                            <TableCell><Badge variant="destructive">{log.errorCode}</Badge></TableCell>
                            <TableCell className="font-mono">{log.errorMessage}</TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => openLogDetails(`Error Log: ${log._id}`, log.stackTrace)}><Eye className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <LogDetailsModal isOpen={modalState.isOpen} onClose={() => setModalState({ ...modalState, isOpen: false })} title={modalState.title} logData={modalState.data} />
    </>
  );
}