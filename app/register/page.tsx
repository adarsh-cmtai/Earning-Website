"use client"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RegistrationFlow } from "@/components/registration/registration-flow"
import { RootState } from "@/lib/redux/store";
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion } from "framer-motion"
import { FullScreenLoader } from "@/components/common/FullScreenLoader";

export default function RegisterPage() {

  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  // useEffect(() => {
  //     if (!isLoading && isAuthenticated) {
  //       if (user?.role === 'admin') {
  //         router.push("/admin/dashboard");
  //       } else {
  //         router.push("/dashboard");
  //       }
  //     }
  //   }, [isLoading, isAuthenticated, user, router]);
  
    // if (isLoading || isAuthenticated) {
    //   return <FullScreenLoader />;
    // }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      <Header />
      <main className="flex-1 flex items-center justify-center relative py-16 px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80rem] h-[80rem] bg-radial-gradient from-primary/5 dark:from-teal-500/10 to-transparent opacity-30 dark:opacity-40"></div>
          {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/10 dark:bg-teal-500/50"
                  initial={{
                      x: `${Math.random() * 100}vw`,
                      y: `${Math.random() * 100}vh`,
                      scale: Math.random() * 0.4 + 0.1,
                      opacity: 0,
                  }}
                  animate={{
                      y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
                      opacity: [0, 0.3, 0],
                  }}
                  transition={{
                      duration: Math.random() * 10 + 15,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                  }}
              />
          ))}
        </div>
        <div className="relative z-10 w-full">
          <RegistrationFlow />
        </div>
      </main>
      <Footer />
    </div>
  )
}