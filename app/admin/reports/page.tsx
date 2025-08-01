"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchReportsData } from "@/lib/redux/features/admin/reportsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ExportReportModal } from "@/components/admin/reports/ExportReportModal";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";

const COLORS = ["#14b8a6", "#0ea5e9"];

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.adminReports);
  const { revenueData, engagementData, incomeDistributionData, complianceData } = data;

  const [modalState, setModalState] = useState<{ isOpen: boolean; reportName: string }>({ isOpen: false, reportName: "" });

  useEffect(() => {
    if(status === 'idle') {
      dispatch(fetchReportsData());
    }
  }, [dispatch, status]);

  const handleOpenModal = (reportName: string) => {
    setModalState({ isOpen: true, reportName });
  };

  if (status === 'loading' || status === 'idle') {
    return <FullScreenLoader />;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Reporting & Analytics</h1>
            <p className="text-muted-foreground">Gain insights into platform performance and user activity.</p>
        </div>
        
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Platform Revenue</CardTitle>
                    <CardDescription>Monthly trend of total platform revenue.</CardDescription>
                </div>
                {/* <Button variant="outline" size="sm" onClick={() => handleOpenModal("Platform Revenue")}><Download className="mr-2 h-4 w-4" />Export</Button> */}
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}><LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis tickFormatter={(val) => `₹${val / 1000}k`} /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} /></LineChart></ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="mt-6">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Daily Active Users (DAU)</CardTitle>
                    <CardDescription>Number of unique users active each day of the week.</CardDescription>
                </div>
                {/* <Button variant="outline" size="sm" onClick={() => handleOpenModal("User Engagement")}><Download className="mr-2 h-4 w-4" />Export</Button> */}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}><BarChart data={engagementData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Income Source Distribution</CardTitle>
                    <CardDescription>Breakdown of where user earnings come from.</CardDescription>
                </div>
                {/* <Button variant="outline" size="sm" onClick={() => handleOpenModal("Income Distribution")}><Download className="mr-2 h-4 w-4" />Export</Button> */}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={incomeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.name} (${entry.value}%)`}>{incomeDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="rounded-lg"><CardHeader><CardTitle>Top Earners</CardTitle><CardDescription>Users with the highest monthly earnings.</CardDescription></CardHeader><CardContent><div className="flex items-center justify-center h-full text-muted-foreground">Top Earners Table (Coming Soon)...</div></CardContent></Card>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <Card className="rounded-lg">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Compliance Issues</CardTitle>
                    <CardDescription>Users with active compliance flags.</CardDescription>
                </div>
                {/* <Button variant="outline" size="sm" onClick={() => handleOpenModal("Compliance Report")}><Download className="mr-2 h-4 w-4" />Export</Button> */}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Compliance Issue</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {complianceData.map((item, i) => (
                        <TableRow key={i}><TableCell>{item.user}</TableCell><TableCell className="text-red-500 font-medium">{item.issue}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ExportReportModal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, reportName: "" })} reportName={modalState.reportName} />
    </>
  );
}