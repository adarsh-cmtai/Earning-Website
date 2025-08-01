"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { logoutUser } from "@/lib/redux/features/authSlice";
import {
  LayoutDashboard, Users, Video, Clapperboard, DollarSign,
  FileText, BarChart2, Shield, Bot, X, Sun, Moon, LogOut, Coins, LifeBuoy, BookOpen, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const allSidebarNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, allowedRoles: ['USER_MANAGER', 'TECHNICIAN', 'FINANCE', 'CONTENT_MANAGER', 'SUPER_ADMIN'] },
  { href: "/admin/users", label: "Users", icon: Users, allowedRoles: ['USER_MANAGER', 'SUPER_ADMIN'] },
  { href: "/admin/assignments", label: "Daily Assignments", icon: Video, allowedRoles: ['TECHNICIAN', 'SUPER_ADMIN'] },
  { href: "/admin/ai-videos", label: "AI Videos", icon: Clapperboard, allowedRoles: ['TECHNICIAN', 'SUPER_ADMIN'] },
  { href: "/admin/income", label: "Income & Payouts", icon: DollarSign, allowedRoles: ['FINANCE', 'SUPER_ADMIN'] },
  { href: "/admin/income-verification", label: "Income Verification", icon: Coins, allowedRoles: ['FINANCE', 'SUPER_ADMIN'] },
  { href: "/admin/support", label: "Support Center", icon: LifeBuoy, allowedRoles: ['USER_MANAGER', 'SUPER_ADMIN'] },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: BookOpen,
    allowedRoles: ["CONTENT_MANAGER", "SUPER_ADMIN"],
  },
  { href: "/admin/content", label: "Content Mgmt", icon: FileText, allowedRoles: ['CONTENT_MANAGER', 'SUPER_ADMIN'] },
  { href: "/admin/reports", label: "Reports", icon: BarChart2, allowedRoles: ['SUPER_ADMIN'] },
  { href: "/admin/security", label: "Security", icon: Shield, allowedRoles: ['SUPER_ADMIN'] },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { theme, setTheme } = useTheme();
  const admin = useSelector((state: RootState) => state.auth.user);

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

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const filteredNavItems = allSidebarNavItems.filter(item => {
    if (admin?.adminRole === 'SUPER_ADMIN') {
        return true;
    }
    return admin?.adminRole && item.allowedRoles.includes(admin.adminRole);
  });

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-4 lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 font-bold">
          <Bot className="h-6 w-6 text-teal-500" />
          <span className="text-lg text-foreground">Admin Panel</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start gap-y-1 p-2 text-sm font-medium lg:p-4">
          {filteredNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all
                  ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-2 border-t border-border/60 p-4">
        <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Go to Home</span>
            </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Log Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>
    </>
  );
}