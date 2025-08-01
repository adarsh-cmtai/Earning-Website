"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingPage } from "@/components/landing/landing-page"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    console.log("this is process", process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      const allRoutes = [
        "/about",
        "/admin",
        "/ai-videos",
        "/assignments",
        "/blog",
        "/contact", 
        "/dashboard",
        "/downline",
        "/faq",
        "/help",
        "/login",
        "/privacy",
        "/profile",
        "/referral-tools",
        "/refund",
        "/register",
        "/success-stories",
        "/terms",
        "/user",
      ]

      allRoutes.forEach((route) => {
        router.prefetch(route)
      })
    }
  }, [])

  return <LandingPage />
}
