"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { logoutUser } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { TawkToWidget } from "@/components/common/TawkToWidget";
import { toast } from "sonner";
import {
  User, Users, Bell, CheckSquare, DollarSign, FileText, HelpCircle,
  Home, LogOut, Menu, Settings, Video, X, Sun, Moon, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navigationGroups = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Daily Assignments", href: "/assignments", icon: CheckSquare },
      { name: "AI Videos", href: "/ai-videos", icon: Video },
    ]
  },
  {
    title: "Analysis",
    items: [
      { name: "Downline", href: "/downline", icon: Users },
      { name: "Income History", href: "/dashboard/income-history", icon: DollarSign },
      { name: "Compliance History", href: "/dashboard/compliance-history", icon: FileText },
    ]
  },
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Support", href: "/dashboard/support", icon: HelpCircle },
    ]
  }
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== 'user') {
        router.push("/admin/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const pageTitle = navigationGroups.flatMap(g => g.items).find((item) => {
    if (item.href === "/dashboard") return pathname === item.href;
    return pathname.startsWith(item.href);
  })?.name || "Dashboard";

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully.", { id: toastId });
      router.push('/login');
    } catch (error) {
      toast.error("Logout failed. Please try again.", { id: toastId });
    }
  };

  const handleNotificationClick = () => {
    router.push("/dashboard/support");
  };

  if (isLoading || !isAuthenticated || user?.role !== 'user') {
    return <FullScreenLoader />;
  }

  const NavLinks = ({ isMobile = false }) => (
    <nav className="flex-1 px-4 py-4 space-y-4">
      {navigationGroups.map((group) => (
        <div key={group.title}>
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500 tracking-wider">{group.title}</h3>
          {group.items.map((item) => {
            const isActive = (item.href === "/dashboard" && pathname === item.href) || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary dark:bg-teal-500/10 dark:text-teal-300 font-semibold" : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200")}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const Logo = () => (
    <Link href="/dashboard" className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 24 24" className="text-primary dark:text-teal-400"><path fill="currentColor" d="M12 2L2 7l10 5l10-5l-10-5zm0 11.5L2 8.5l10 5l10-5l-10 5zM2 17l10 5l10-5l-10-5l-10 5z" /></svg>
      <span className="font-bold text-xl text-gray-900 dark:text-slate-100">UEIEP</span>
    </Link>
  );

  const LogoutButton = () => (
    <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400/80 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10" onClick={handleLogout}>
      <LogOut className="h-5 w-5 mr-3" />
      Logout
    </Button>
  );

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-slate-800">
        <Logo />
        {isMobile && <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>}
      </div>
      <div className="flex-1 overflow-y-auto"><NavLinks isMobile={isMobile} /></div>
      <div className="px-4 py-4 border-t border-gray-200 dark:border-slate-800"><LogoutButton /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-200">
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" onClick={() => setSidebarOpen(false)} />
        <aside className="fixed inset-y-0 left-0 flex w-64 flex-col shadow-lg"><SidebarContent isMobile={true} /></aside>
      </div>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-gray-200 dark:border-slate-800"><SidebarContent /></aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-x-6 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="-ml-2.5 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6 text-gray-700 dark:text-slate-300" /></Button>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-slate-300" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative rounded-full text-gray-600 dark:text-slate-300"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600 dark:text-slate-300" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /><Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800/50 cursor-pointer">
                  <Avatar className="h-9 w-9"><AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=random`} /><AvatarFallback className="font-semibold text-white bg-gradient-to-br from-teal-500 to-sky-500">{user?.fullName?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block pr-2">{user?.fullName}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">{user?.fullName}</p><p className="text-xs leading-none text-muted-foreground">{user?.email}</p></div></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/profile')}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/dashboard/support')}><Settings className="mr-2 h-4 w-4" />Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/50"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
      <TawkToWidget />
    </div>
  );
}