"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/redux/features/user/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertTriangle, Bell, CheckCircle, DollarSign, Info, Video } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenterContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: allNotifications, status } = useSelector((state: RootState) => state.userNotifications);
  
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "income": return <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "assignment": return <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case "referral": return <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
      case "video": return <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "alert": return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case "system": return <Info className="h-5 w-5 text-gray-500 dark:text-slate-400" />;
      default: return <Bell className="h-5 w-5 text-gray-500 dark:text-slate-400" />;
    }
  };
  
  const unreadNotifications = allNotifications.filter((notif) => !notif.read);

  const NotificationCard = ({ notif }: { notif: typeof allNotifications[0] }) => (
    <div className={`p-4 flex items-start gap-4 transition-colors ${!notif.read ? 'bg-sky-50 dark:bg-slate-800/50' : 'bg-transparent opacity-80 dark:opacity-60 hover:opacity-100'}`}>
      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-700/50`}>{getIcon(notif.type)}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-slate-200">{notif.title}</h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{notif.description}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-slate-500">{formatDistanceToNow(new Date(notif.createdAt))} ago</p>
            {!notif.read && (<Button variant="link" size="sm" onClick={() => handleMarkAsRead(notif._id)} className="text-primary dark:text-teal-400 h-auto p-0">Mark as Read</Button>)}
        </div>
      </div>
    </div>
  );

  const renderList = (list: typeof allNotifications, type: 'unread' | 'all') => {
    if (status === 'loading') {
        return <Card><CardContent className="text-center py-20 text-muted-foreground">Loading notifications...</CardContent></Card>;
    }
    if (list.length === 0) {
        return (
            <Card><CardContent className="text-center py-20 text-muted-foreground">
                {type === 'unread' ? <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" /> : <Bell className="h-12 w-12 mx-auto mb-4" />}
                <p className="text-lg font-semibold">{type === 'unread' ? "You're all caught up!" : "No notifications yet."}</p>
                <p className="text-sm">{type === 'unread' ? "No new notifications." : "Your activity will appear here."}</p>
            </CardContent></Card>
        );
    }
    return (
        <div className="space-y-0 rounded-lg border overflow-hidden">
            {list.map((notif, index) => (
               <div key={notif._id} className={index < list.length - 1 ? 'border-b' : ''}><NotificationCard notif={notif} /></div>
            ))}
        </div>
    );
  };

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-slate-900 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
        <p className="text-muted-foreground text-lg">Stay updated with all your activities, alerts, and platform news.</p>
      </div>
      <Tabs defaultValue="unread" className="w-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <TabsList><TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger><TabsTrigger value="all">All Notifications</TabsTrigger></TabsList>
          {unreadNotifications.length > 0 && (<Button variant="outline" onClick={handleMarkAllAsRead}>Mark All as Read</Button>)}
        </div>
        <TabsContent value="unread">{renderList(unreadNotifications, 'unread')}</TabsContent>
        <TabsContent value="all">{renderList(allNotifications, 'all')}</TabsContent>
      </Tabs>
    </div>
  );
}