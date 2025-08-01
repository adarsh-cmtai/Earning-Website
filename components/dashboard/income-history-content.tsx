"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchIncomeData } from "@/lib/redux/features/user/incomeSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, CheckCircle, DollarSign, Search, TrendingUp, Video, Banknote, AlertTriangle, Info } from "lucide-react";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { ContributionPaymentModal } from "./contribution-payment-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export function IncomeHistoryContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary: incomeSummary, transactions, contributions, status } = useSelector((state: RootState) => state.userIncome);

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => { dispatch(fetchIncomeData()); }, [dispatch]);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Completed": case "Success": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      default: return "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const summaryCards = [
    { icon: DollarSign, title: "Current Balance", value: incomeSummary.totalBalance, color: "text-teal-600 dark:text-teal-400" },
    { icon: TrendingUp, title: "Total Withdrawn", value: incomeSummary.totalWithdrawn, color: "text-green-600 dark:text-green-400" },
    { icon: Users, title: "Referral Earnings", value: incomeSummary.totalReferralEarnings, color: "text-sky-600 dark:text-sky-400" },
    { icon: CheckCircle, title: "Assignment Earnings", value: incomeSummary.totalAssignmentEarnings, color: "text-purple-600 dark:text-purple-400" },
    { icon: Video, title: "YouTube Earnings", value: incomeSummary.totalYoutubeEarnings, color: "text-orange-600 dark:text-orange-400" },
  ];

  if (status === 'loading' || status === 'idle') { return <FullScreenLoader />; }

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Income & Contributions</h1>
          <p className="text-muted-foreground text-lg">Track your earnings, withdrawals, and platform fee payments.</p>
        </div>

        {incomeSummary.alerts?.length > 0 && (
            <div className="space-y-4">
                {incomeSummary.alerts.map((alert: any) => (
                    <Alert key={alert._id} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                    </Alert>
                ))}
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryCards.map(item => (<Card key={item.title}><CardContent className="p-4 text-center"><item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} /><p className="text-sm font-medium text-muted-foreground">{item.title}</p><p className="text-xl font-bold">₹{(item.value || 0).toLocaleString()}</p></CardContent></Card>))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle>Platform Contribution</CardTitle>
                <CardDescription>Pay a percentage of your current balance as a platform fee.</CardDescription>
                <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300">Admin Suggestion</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">The suggested contribution for this month is <strong>{incomeSummary.suggestedContributionPercentage}%</strong>.</p>
                    </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-primary">₹{(incomeSummary.totalBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <Button onClick={() => setPaymentModalOpen(true)} disabled={(incomeSummary.totalBalance || 0) <= 0}>
                  <Banknote className="mr-2 h-4 w-4" /> Pay Contribution
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="earnings">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="earnings">Earnings & Payouts</TabsTrigger><TabsTrigger value="contributions">Contribution History</TabsTrigger></TabsList>
          
          <TabsContent value="earnings">
            <Card><CardHeader><CardTitle>Verified Income History</CardTitle><CardDescription>A detailed log of all your income and withdrawal activities.</CardDescription></CardHeader>
              <CardContent>
                <Table><TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount (₹)</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (<TableRow key={txn._id}><TableCell className="font-medium">{txn.description}</TableCell><TableCell>{format(new Date(txn.createdAt), 'PP')}</TableCell><TableCell><Badge variant="outline" className={txn.type === "Credit" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}>{txn.type}</Badge></TableCell><TableCell>{txn.category}</TableCell><TableCell className={`text-right font-semibold ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>{txn.type === "Credit" ? "+" : "-"}₹{Math.abs(txn.amount).toLocaleString()}</TableCell></TableRow>))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contributions">
            <Card><CardHeader><CardTitle>Contribution Payment History</CardTitle><CardDescription>A log of all platform fees you have paid.</CardDescription></CardHeader>
              <CardContent>
                <Table><TableHeader><TableRow><TableHead>Payment For</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Payment ID</TableHead><TableHead className="text-right">Amount (₹)</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {contributions.map((c) => (<TableRow key={c._id}><TableCell className="font-medium">{c.period}</TableCell><TableCell>{format(new Date(c.createdAt), 'PP')}</TableCell><TableCell><Badge className={getStatusClasses(c.status)} variant="outline">{c.status}</Badge></TableCell><TableCell className="font-mono text-xs">{c.paymentId.replace('mock_payment_', '...')}</TableCell><TableCell className="text-right font-semibold">₹{c.amount.toLocaleString()}</TableCell></TableRow>))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ContributionPaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} currentBalance={incomeSummary.totalBalance || 0} />
    </>
  )
}