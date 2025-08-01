"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Bot } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6 md:hidden">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 font-semibold"
      >
        <Bot className="h-6 w-6 text-teal-500" />
        <span className="dark:text-white">Admin</span>
      </Link>
      <Button variant="outline" size="icon" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}