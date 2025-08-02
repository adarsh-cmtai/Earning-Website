"use client";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { fetchUserDashboardData } from "@/lib/redux/features/user/dashboardSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { format } from "date-fns";
import { ArrowRight, CheckCircle, Clock, Copy, DollarSign, Gift, Lock, Megaphone, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ProfileStatusCard } from "./ProfileStatusCard";

export function DashboardContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.userDashboard);
  console.log("this is data", data);
  const { userProfile, dailyAssignment, aiVideo, income, referral, announcements } = data;

  useEffect(() => { dispatch(fetchUserDashboardData()); }, [dispatch]);

  const handleCopyReferral = () => {
    if (!referral?.referralId) return;
    const referralLink = `${window.location.origin}/register?ref=${referral.referralId}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const assignmentProgress = dailyAssignment?.total > 0 ? (dailyAssignment.completed / dailyAssignment.total) * 100 : 0;

  if (status === 'loading' || status === 'idle') { return <FullScreenLoader />; }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {userProfile?.fullName}!</h1><p className="text-muted-foreground">Let's make today a productive one.</p></div>
        <div className="flex items-center gap-2"><Button asChild><Link href="/assignments">Start Assignments <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Current Balance</CardTitle><DollarSign className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{(income?.currentBalance ?? 0).toLocaleString()}</div><p className="text-xs text-muted-foreground">Total available balance</p></CardContent></Card>
        <Card className="hover:border-primary/50 transition-colors"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Monthly Income</CardTitle><TrendingUp className="h-5 w-5 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{(income?.monthlyYoutubeIncome ?? 0).toLocaleString()}</div><p className="text-xs text-muted-foreground">Earnings this month</p></CardContent></Card>
        <Card className="hover:border-primary/50 transition-colors"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Direct Referrals</CardTitle><Users className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">+{referral?.directReferrals ?? 0}</div><p className="text-xs text-muted-foreground">New members in Level 1</p></CardContent></Card>
        <Card className="hover:border-primary/50 transition-colors"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Platform Dues</CardTitle><TrendingDown className="h-5 w-5 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">₹{(income?.platformContributionDue ?? 0).toLocaleString()}</div><p className="text-xs text-muted-foreground">Contribution pending</p></CardContent></Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <Card className="shadow-sm"><CardHeader><CardTitle>Today's Assignments</CardTitle><CardDescription>Complete your tasks to unlock your daily earnings.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Progress value={assignmentProgress} className="h-2" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full"><Clock className="h-5 w-5 text-blue-500" /></div><div><div className="font-semibold">{dailyAssignment?.pending ?? 0} Pending</div><div className="text-muted-foreground">Tasks to complete</div></div></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full"><CheckCircle className="h-5 w-5 text-green-500" /></div><div><div className="font-semibold">{dailyAssignment?.completed ?? 0} Completed</div><div className="text-muted-foreground">Out of {dailyAssignment?.total ?? 0} total</div></div></div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md"><div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full"><Gift className="h-5 w-5 text-purple-500" /></div><div><div className="font-semibold">{assignmentProgress.toFixed(0)}%</div><div className="text-muted-foreground">Progress today</div></div></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm"><CardHeader><CardTitle>Platform Updates</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {announcements && announcements.length > 0 ? announcements.map((item: any) => (<Alert key={item._id} className={`${item.type === 'warning' ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-500/10' : 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-500/10'}`}><Megaphone className={`h-4 w-4 ${item.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} /><AlertTitle>{item.title}</AlertTitle><AlertDescription>{item.content}</AlertDescription></Alert>)) : (<div className="text-center py-6 text-muted-foreground"><CheckCircle className="mx-auto h-10 w-10 mb-2" /><p className="font-medium">All caught up!</p><p className="text-sm">There are no new announcements.</p></div>)}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          <ProfileStatusCard status={userProfile?.youtubeStatus ?? 'Not Linked'} topic={userProfile?.selectedTopic} channelName={userProfile?.channelName} />

          <Card className="shadow-sm">
            <CardHeader><CardTitle>Grow Your Network</CardTitle><CardDescription>Share your link to earn referral bonuses.</CardDescription></CardHeader>
            <CardContent>
              {userProfile?.youtubeStatus === 'Verified' ? (
                <div className="space-y-4">
                  <div className="space-y-1"><label htmlFor="referral-link" className="text-xs font-medium text-muted-foreground">Your Referral Link</label><div className="flex gap-2"><Input id="referral-link" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referral?.referralId ?? ''}`} className="h-9" /><Button size="icon" variant="ghost" onClick={handleCopyReferral}><Copy className="h-4 w-4" /></Button></div></div>
                  <Button asChild className="w-full"><Link href="/downline"><Users className="mr-2 h-4 w-4" /> View Downline</Link></Button>
                </div>
              ) : (
                <div className="text-center p-4 bg-muted rounded-md"><Lock className="mx-auto h-6 w-6 text-muted-foreground mb-2" /><p className="text-sm font-medium">Referral System Locked</p><p className="text-xs text-muted-foreground">Your referral link will be generated once your Social Media channel is approved.</p></div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm"><CardHeader><CardTitle>AI Video Status</CardTitle></CardHeader>
            <CardContent>
              {aiVideo?.current ? (
                <div className="p-3 rounded-md bg-green-50 dark:bg-green-500/10 border">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300">New Video Available</h4>
                      <p className="text-sm text-green-700 dark:text-green-400 truncate">{aiVideo.current.title}</p>
                    </div>
                    <Button size="sm" asChild>
                      <a href="/ai-videos" target="_blank" rel="noreferrer">
                        Go to AI Video
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center py-2 text-muted-foreground">No new video is assigned.</p>
              )}
              {aiVideo?.lastDownloaded && <p className="text-xs text-muted-foreground mt-3">Last Downloaded: {format(new Date(aiVideo.lastDownloaded.updatedAt), 'PP')}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
