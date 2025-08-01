"use client"

import { useState } from "react"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      {/* Sidebar component ko state pass karenge */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onClose={handleCloseMenu} 
      />
      <div className="flex flex-col">
        {/* Header ko menu open karne ke liye function denge */}
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}