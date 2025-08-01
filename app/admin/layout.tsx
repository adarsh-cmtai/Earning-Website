"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'admin' && user?.adminRole === undefined))) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleCloseMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  if (isLoading || !isAuthenticated || (user?.role !== 'admin' && user?.adminRole === undefined)) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onClose={handleCloseMenu} 
      />
      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}