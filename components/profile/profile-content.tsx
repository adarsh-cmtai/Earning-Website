"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Eye, EyeOff, Lock, LogOut, Shield, Smartphone, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProfileData, updatePersonalDetails, updatePaymentDetails, changePassword, logoutAllDevices } from "@/lib/redux/features/user/profileSlice";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { formatDistanceToNow } from "date-fns";

export function ProfileContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, status } = useSelector((state: RootState) => state.userProfile);
  
  const [personalData, setPersonalData] = useState({ fullName: "", mobile: "" });
  const [paymentData, setPaymentData] = useState({ upiName: "", upiId: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  useEffect(() => { dispatch(fetchProfileData()); }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setPersonalData({ fullName: profile.fullName || '', mobile: profile.mobile || '' });
      setPaymentData({ upiName: profile.upiName || '', upiId: profile.upiId || '' });
    }
  }, [profile]);

  const handleSave = async (section: 'personal' | 'payment') => {
    if (section === 'personal') {
      const toastId = toast.loading("Updating Personal Information...");
      try {
        await dispatch(updatePersonalDetails(personalData)).unwrap();
        toast.success("Personal Information updated successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(error || "Failed to update Personal Information.", { id: toastId });
      }
    } else if (section === 'payment') {
      const toastId = toast.loading("Updating Payment Information...");
      try {
        await dispatch(updatePaymentDetails(paymentData)).unwrap();
        toast.success("Payment Information updated successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(error || "Failed to update Payment Information.", { id: toastId });
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }
    const toastId = toast.loading("Updating password...");
    try {
        await dispatch(changePassword({currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword})).unwrap();
        toast.success("Password updated successfully!", { id: toastId });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) { toast.error(error || "Failed to update password.", { id: toastId }); }
  };
  
  const handleLogoutAll = async () => {
    const toastId = toast.loading("Logging out all other devices...");
    try {
        await dispatch(logoutAllDevices()).unwrap();
        toast.success("Successfully logged out from all other devices.", { id: toastId });
        dispatch(fetchProfileData());
    } catch (error: any) { toast.error(error || "Failed to log out devices.", { id: toastId }); }
  };

  if (status === 'loading' || status === 'idle' || !profile) { return <FullScreenLoader />; }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <Card className="overflow-hidden">
        <div className="bg-muted/30 p-6 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={`https://avatar.vercel.sh/${profile.email}.png`} />
            <AvatarFallback>{profile.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
          <TabsTrigger value="profile" className="py-3"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
          <TabsTrigger value="payment" className="py-3"><CreditCard className="mr-2 h-4 w-4"/>Payment</TabsTrigger>
          <TabsTrigger value="security" className="py-3"><Lock className="mr-2 h-4 w-4"/>Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
            <Card><CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your personal details here.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="grid sm:grid-cols-2 gap-6"><div className="space-y-1.5"><Label htmlFor="fullName">Full Name</Label><p className="text-sm text-muted-foreground">This name will be displayed on your profile.</p><Input id="fullName" value={personalData.fullName} onChange={(e) => setPersonalData(p => ({...p, fullName: e.target.value}))}/></div><div className="space-y-1.5"><Label htmlFor="mobile">Mobile Number</Label><p className="text-sm text-muted-foreground">Used for account recovery and SMS.</p><Input id="mobile" value={personalData.mobile} onChange={(e) => setPersonalData(p => ({...p, mobile: e.target.value}))}/></div></div><div className="space-y-1.5"><Label htmlFor="email">Email Address</Label><p className="text-sm text-muted-foreground">Your email address is linked to your account and cannot be changed.</p><Input id="email" type="email" value={profile.email} disabled /></div></CardContent><CardFooter className="border-t pt-6 flex justify-end"><Button onClick={() => handleSave("personal")}>Save Changes</Button></CardFooter></Card>
        </TabsContent>

        <TabsContent value="payment">
            <Card><CardHeader><CardTitle>Payment Information</CardTitle><CardDescription>Your UPI details for receiving payments.</CardDescription></CardHeader><CardContent className="space-y-6"><div className="grid sm:grid-cols-2 gap-6"><div className="space-y-1.5"><Label htmlFor="upiName">UPI Recipient Name</Label><p className="text-sm text-muted-foreground">The name registered with your UPI ID.</p><Input id="upiName" value={paymentData.upiName} onChange={(e) => setPaymentData(p => ({...p, upiName: e.target.value}))} /></div><div className="space-y-1.5"><Label htmlFor="upiId">UPI ID</Label><p className="text-sm text-muted-foreground">e.g., yourname@bank</p><Input id="upiId" value={paymentData.upiId} onChange={(e) => setPaymentData(p => ({...p, upiId: e.target.value}))} /></div></div></CardContent><CardFooter className="border-t pt-6 flex justify-between items-center"><p className="text-sm text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4" /> Your payment data is secure and encrypted.</p><Button onClick={() => handleSave("payment")}>Update UPI Details</Button></CardFooter></Card>
        </TabsContent>

        <TabsContent value="security" className="grid lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1"><CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Use a strong, unique password for your security.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-1.5 relative"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}/><Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8 text-muted-foreground" onClick={() => setShowPasswords(p => ({...p, current: !p.current}))}>{showPasswords.current ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</Button></div><div className="space-y-1.5 relative"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type={showPasswords.new ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}/><Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8 text-muted-foreground" onClick={() => setShowPasswords(p => ({...p, new: !p.new}))}>{showPasswords.new ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</Button></div><div className="space-y-1.5 relative"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type={showPasswords.confirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}/><Button variant="ghost" size="icon" className="absolute right-1 top-7 h-8 w-8 text-muted-foreground" onClick={() => setShowPasswords(p => ({...p, confirm: !p.confirm}))}>{showPasswords.confirm ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</Button></div></CardContent><CardFooter className="border-t pt-6 flex justify-end"><Button onClick={handlePasswordUpdate}>Update Password</Button></CardFooter></Card>
            <Card className="lg:col-span-1"><CardHeader><CardTitle>Active Sessions</CardTitle><CardDescription>Devices that have logged into your account.</CardDescription></CardHeader><CardContent className="space-y-4 max-h-96 overflow-y-auto">{profile.activeSessions?.map((device: any) => (<div key={device.deviceId} className="flex items-center justify-between p-3 rounded-md bg-muted/50"><div className="flex items-center gap-4">{device.isMobile ? <Smartphone className="h-6 w-6 text-muted-foreground"/> : <Laptop className="h-6 w-6 text-muted-foreground"/>}<div><p className="font-semibold text-sm">{device.deviceName}</p><p className="text-xs text-muted-foreground">{device.ipAddress} • {formatDistanceToNow(new Date(device.lastActive))} ago</p></div></div>{device.isCurrent ? (<Badge variant="outline">Current</Badge>) : null}</div>))} </CardContent><CardFooter className="border-t pt-6 flex justify-end"><Button variant="outline" onClick={handleLogoutAll}><LogOut className="mr-2 h-4 w-4" />Logout Other Devices</Button></CardFooter></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}