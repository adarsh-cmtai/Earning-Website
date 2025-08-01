"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchDownlineData, submitManualIncome } from "@/lib/redux/features/user/downlineSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ChevronRight, Copy, DollarSign, Share2, TrendingUp, Upload, UserPlus, CheckCircle, FileUp, X, Eye } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { format } from 'date-fns';

export function DownlineContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: referralData, status } = useSelector((state: RootState) => state.userDownline);

  const [openLevels, setOpenLevels] = useState<Record<number, boolean>>({ 1: true });
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [incomeDetails, setIncomeDetails] = useState({ month: '', year: new Date().getFullYear().toString(), amount: '' });

  useEffect(() => {
    if (status === 'idle') { dispatch(fetchDownlineData()); }
  }, [status, dispatch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Referral link copied to clipboard!");
  };

  const toggleLevel = (level: number) => {
    setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { toast.error("File size cannot exceed 10MB."); return; }
      setIncomeFile(file);
    }
  };

  const handleManualIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeFile || !incomeDetails.month || !incomeDetails.year || !incomeDetails.amount) {
      toast.error("Please fill all fields and upload a screenshot.");
      return;
    }
    const formData = new FormData();
    formData.append('screenshot', incomeFile);
    formData.append('month', incomeDetails.month);
    formData.append('year', incomeDetails.year);
    formData.append('amount', incomeDetails.amount);

    const toastId = toast.loading("Submitting manual income...");
    try {
      await dispatch(submitManualIncome(formData)).unwrap();
      toast.success("Income submitted for verification!", { id: toastId });
      setIncomeFile(null);
      setIncomeDetails({ month: '', year: new Date().getFullYear().toString(), amount: '' });
    } catch (error: any) {
      toast.error(error?.message || "Submission failed. You may have already submitted for this month.", { id: toastId });
    }
  };
  
  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-semibold px-2 py-0.5 rounded-full";
    switch (status) {
      case 'Approved': return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`}>Approved</span>;
      case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`}>Pending</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`}>{status}</span>;
    }
  };
  
  if (status === 'loading' || status === 'idle') { return <FullScreenLoader />; }
  
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-black">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Downline Command Center</h1>
        <p className="text-muted-foreground">Manage your network, track earnings, and drive growth.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex items-center gap-4"><div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg"><Users className="h-6 w-6 text-blue-600 dark:text-blue-400" /></div><div><p className="text-sm text-muted-foreground">Total Referrals</p><p className="text-2xl font-bold">{referralData?.totalReferrals ?? 0}</p></div></div>
        <div className="p-6 flex items-center gap-4 sm:border-l"><div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg"><TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Active Members</p><p className="text-2xl font-bold">{referralData?.activeReferrals ?? 0}</p></div></div>
        <div className="p-6 flex items-center gap-4 sm:border-l"><div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg"><DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">Current Balance</p><p className="text-2xl font-bold">₹{(referralData?.currentBalance ?? 0).toLocaleString()}</p></div></div>
        <div className="p-6 flex items-center gap-4 sm:border-l"><div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg"><Share2 className="h-6 w-6 text-orange-600 dark:text-orange-400" /></div><div><p className="text-sm text-muted-foreground">Active Levels</p><p className="text-2xl font-bold">{referralData?.levels?.length ?? 0}</p></div></div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader><CardTitle>Downline Structure</CardTitle><CardDescription>Click on a level to view its members.</CardDescription></CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground">
                            <div className="col-span-3">LEVEL / MEMBER</div>
                            <div className="col-span-1 text-center">STATUS</div>
                            <div className="col-span-2 text-right">INCOME</div>
                        </div>
                        <div className="space-y-1 p-1">
                        {referralData?.levels?.map((level: any) => (
                            <Collapsible key={level.level} open={!!openLevels[level.level]} onOpenChange={() => toggleLevel(level.level)}>
                                <CollapsibleTrigger asChild>
                                    <div className="grid grid-cols-6 gap-4 items-center w-full p-3 rounded-md hover:bg-muted/80 transition-colors cursor-pointer">
                                        <div className="col-span-3 flex items-center gap-3"><ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${openLevels[level.level] ? 'rotate-90' : ''}`} /><p className="font-bold">Level {level.level}</p><Badge variant="secondary">{level.count} Members</Badge></div>
                                        <div className="col-span-1 text-center"><Badge variant="outline">{level.percentage}%</Badge></div>
                                        <div className="col-span-2 text-right font-bold text-lg text-green-600">₹{level.income.toLocaleString()}</div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-8 pr-2 pb-1">
                                    <div className="border-l-2">{level.members.map((member: any, index: number) => (<div key={member._id} className={`grid grid-cols-6 gap-4 items-center py-2 pl-4 pr-2 rounded-r-md ${index % 2 === 0 ? 'bg-muted/40' : ''}`}><div className="col-span-3 flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={`https://avatar.vercel.sh/${member.userIdMasked}.png`} /><AvatarFallback>{member.userIdMasked[0]}</AvatarFallback></Avatar><div><p className="font-medium text-sm">{member.userIdMasked}</p><p className="text-xs text-muted-foreground">Joined: {format(new Date(member.joinDate), 'd MMM yyyy')}</p></div></div><div className="col-span-1 text-center">{getStatusBadge(member.status)}</div><div className="col-span-2 text-right font-medium text-sm text-green-600">₹{member.incomeContribution}</div></div>))}</div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <aside className="lg:col-span-2 space-y-6">
            <Card><CardHeader><CardTitle>Growth Tools</CardTitle><CardDescription>Expand your network by inviting new members.</CardDescription></CardHeader><CardContent className="space-y-4"><Button size="lg" className="w-full" onClick={() => copyToClipboard(referralData?.referralLink ?? '')}><UserPlus className="mr-2 h-5 w-5" /> Invite & Copy Link</Button><p className="text-xs text-muted-foreground text-center">Clicking the button copies your unique referral link to the clipboard, ready to be shared.</p></CardContent></Card>
            <Card>
                <CardHeader><CardTitle>Manual Income Submission</CardTitle><CardDescription>Submit your monthly Social Media income for verification.</CardDescription></CardHeader>
                <form onSubmit={handleManualIncomeSubmit}><CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="month">Month</Label><Select required value={incomeDetails.month} onValueChange={(val) => setIncomeDetails(p => ({...p, month: val}))}><SelectTrigger id="month"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label htmlFor="year">Year</Label><Input id="year" type="number" value={incomeDetails.year} onChange={(e) => setIncomeDetails(p => ({...p, year: e.target.value}))} /></div>
                    </div>
                    <div><Label htmlFor="amount">Income Amount (₹)</Label><Input id="amount" type="number" placeholder="e.g., 15000" value={incomeDetails.amount} onChange={(e) => setIncomeDetails(p => ({...p, amount: e.target.value}))} required /></div>
                    <div><Label htmlFor="screenshot">Analytics Screenshot</Label><Input id="screenshot" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} required className="file:text-primary file:font-medium" /></div>
                    {incomeFile && <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm"><CheckCircle className="h-4 w-4 text-green-500" /><span>{incomeFile.name}</span><Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setIncomeFile(null)}><X className="h-4 w-4"/></Button></div>}
                </CardContent><CardFooter><Button type="submit" className="w-full" disabled={!incomeFile}><Upload className="mr-2 h-4 w-4" /> Submit for Verification</Button></CardFooter></form>
            </Card>
        </aside>
      </div>
    </main>
  );
}