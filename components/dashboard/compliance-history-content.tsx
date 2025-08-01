"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchComplianceHistory } from "@/lib/redux/features/user/complianceSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle, Info, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { format } from 'date-fns';

export function ComplianceHistoryContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { records: complianceRecords, status } = useSelector((state: RootState) => state.userCompliance);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchComplianceHistory());
    }
  }, [status, dispatch]);

  const filteredRecords = complianceRecords.filter((record) => {
    return filterStatus === "all" || record.status.toLowerCase() === filterStatus;
  });

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pass": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "Warning": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      case "Fail": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default: return "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "info": return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  const summaryCards = [
    { icon: CheckCircle, title: "Total Passes", value: complianceRecords.filter(r => r.status === 'Pass').length, color: "text-green-600 dark:text-green-400" },
    { icon: AlertTriangle, title: "Total Warnings", value: complianceRecords.filter(r => r.status === 'Warning').length, color: "text-yellow-600 dark:text-yellow-400" },
    { icon: XCircle, title: "Total Failures", value: complianceRecords.filter(r => r.status === 'Fail').length, color: "text-red-600 dark:text-red-400" },
  ];

  if (status === 'loading' || status === 'idle') {
    return <FullScreenLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Compliance History</h1>
        <p className="text-muted-foreground text-lg">Review your platform compliance, warnings, and penalties.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map(item => (<Card key={item.title} className="rounded-lg"><CardContent className="p-6 text-center"><item.icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} /><p className="text-sm font-medium text-muted-foreground">{item.title}</p><p className="text-2xl font-bold">{item.value}</p></CardContent></Card>))}
      </div>
      <Card className="rounded-lg">
        <CardHeader><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><CardTitle>Compliance Records</CardTitle><CardDescription className="mt-1">A detailed log of all your compliance activities.</CardDescription></div><Tabs defaultValue="all" onValueChange={setFilterStatus} className="w-full md:w-auto"><TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-slate-800 border"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="pass">Pass</TabsTrigger><TabsTrigger value="warning">Warning</TabsTrigger><TabsTrigger value="fail">Fail</TabsTrigger></TabsList></Tabs></div></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Details</TableHead><TableHead>Action Taken</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-4" /><p className="text-lg font-semibold">No records found for this filter.</p></TableCell></TableRow>) : (filteredRecords.map((record) => (<TableRow key={record._id}><TableCell>{format(new Date(record.createdAt), 'PP')}</TableCell><TableCell className="font-medium">{record.type}</TableCell><TableCell><Badge className={getStatusClasses(record.status)} variant="outline"><div className="flex items-center gap-1">{getSeverityIcon(record.severity)}<span>{record.status}</span></div></Badge></TableCell><TableCell className="text-sm text-muted-foreground max-w-xs truncate">{record.details}</TableCell><TableCell className="text-sm text-muted-foreground">{record.actionTaken}</TableCell></TableRow>)))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Alert className="border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-200">
        <Info className="h-5 w-5 text-sky-600 dark:text-sky-400" /><AlertTitle className="font-bold">Understanding Compliance</AlertTitle><AlertDescription className="mt-2 space-y-1 text-sm"><p>Maintaining good compliance ensures smooth operations and maximizes your earning potential.</p><ul className="list-disc pl-5"><li><strong>Assignments:</strong> Aim for 100% completion daily.</li><li><strong>Content:</strong> Upload AI videos promptly and adhere to Social Media's guidelines.</li><li><strong>Referrals:</strong> Avoid fraudulent referrals or spamming.</li></ul><p className="pt-1">For details, see our <a href="/terms" className="underline font-semibold">Terms & Conditions</a>.</p></AlertDescription>
      </Alert>
    </div>
  );
}