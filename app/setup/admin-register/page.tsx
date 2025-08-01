"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { AdminSignupForm } from "@/components/auth/admin-signup-form"

export default function AdminRegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <AdminSignupForm />
      </main>
      <Footer />
    </div>
  )
}