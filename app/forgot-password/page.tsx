"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  );
}