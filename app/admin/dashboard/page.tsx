"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchDashboardData } from "@/lib/redux/features/admin/dashboardSlice";
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, UserPlus, AlertTriangle, Activity, ShieldAlert, FileDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                        <span className="font-bold">{label}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                        <span className="font-bold text-primary">₹{payload[0].value.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const DashboardSkeleton = () => (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-full sm:w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Card key={i}><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-6 rounded-full" /></CardHeader><CardContent><Skeleton className="h-8 w-32 mt-1" /><Skeleton className="h-3 w-20 mt-2" /></CardContent></Card>)}
        </div>
        <Card><CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-48 mt-2" /></CardHeader><CardContent><Skeleton className="h-[350px] w-full" /></CardContent></Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/2" /></div></div>)}</CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/2" /></div></div>)}</CardContent></Card>
        </div>
    </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.adminDashboard);
  const { stats, alerts, activities, revenueData } = data;

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const adminStats = [
    { title: "Total Users", value: stats?.totalUsers, icon: Users, description: "All registered users" },
    { title: "Platform Revenue", value: `₹${stats?.platformRevenue?.toLocaleString() ?? "..."}`, icon: DollarSign, description: "Last 30 days" },
    { title: "New Users (24h)", value: `+${stats?.newRegistrations?.toLocaleString() ?? "..."}`, icon: UserPlus, description: "Last 24 hours" },
    { title: "Total Admins", value: stats?.totalAdmins, icon: ShieldAlert, description: "System administrators" },
  ];
  
  const getAlertIcon = (type: string) => {
    switch(type) {
        case "error": return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />;
        case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
        default: return <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-500" />;
    }
  }

  if (status === 'loading' || status === 'idle') {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight ">Admin Dashboard</h1>
            <p className="text-muted-foreground">Today is {format(new Date(), 'eeee, MMMM do')}. Here's your overview.</p>
        </div>
        {/* <Button className="w-full sm:w-auto"><FileDown className="mr-2 h-4 w-4" /> Create Report</Button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{stat.title}</CardTitle><stat.icon className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Platform Revenue Overview</CardTitle>
              <CardDescription>Monthly platform revenue trend for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-yellow-500 dark:text-yellow-400" />System Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {alerts && alerts.slice(0, 5).map((alert: any) => (
              <div key={alert._id} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0"><h4 className="font-medium text-sm truncate">{alert.title}</h4><p className="text-xs text-muted-foreground truncate">{alert.description}</p></div>
                <p className="text-xs text-muted-foreground flex-shrink-0">{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {activities && activities.slice(0, 5).map((activity: any) => (
                <div key={activity._id} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg">
                  <Avatar className="h-9 w-9"><AvatarImage src={`https://ui-avatars.com/api/?name=${activity.adminEmail}`} /><AvatarFallback>{activity.adminEmail.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: activity.details.replace(activity.adminEmail, `<strong class="font-semibold">${activity.adminEmail}</strong>`) }}></p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</p>
                  </div>
                  <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className={activity.status === 'success' ? 'bg-green-500/20 text-green-700 dark:text-green-300' : ''}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}