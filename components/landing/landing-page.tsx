"use client"

import { Header } from "./header"
import { Footer } from "./footer"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { CtaSection } from "./cta-section"
import { HowItWorksSection } from "./how-it-works-section"
import { IncomeStreamsSection } from "./income-streams-section"
import { TestimonialsSection } from "./testimonials-section"
// Aap yahan FAQ section ko bhi import kar sakte hain agar chahein.
// import { FaqSection } from "./faq-section"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <IncomeStreamsSection />
        <TestimonialsSection />
        <CtaSection />
        {/* <FaqSection /> */}
      </main>
      <Footer />
    </div>
  )
}