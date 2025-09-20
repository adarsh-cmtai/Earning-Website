"use client"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { motion, useInView } from "framer-motion"
import { AlertTriangle, CheckCircle, Scale } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "overview", title: "2. Platform Overview" },
  { id: "responsibilities", title: "3. Admin Responsibilities" },
  { id: "payments", title: "4. Income & Payments" },
  { id: "referral", title: "5. Referral Program" },
  { id: "termination", title: "6. Account Termination" },
  { id: "contact", title: "7. Contact Information" },
]

const Callout = ({
  icon: Icon,
  title,
  children,
  variant = "info",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning" | "danger";
}) => {
  const variants = {
    info: "bg-sky-50 border-sky-500/30 text-sky-900 dark:bg-slate-900/50 dark:border-sky-500/30 dark:text-sky-200",
    warning:
      "bg-yellow-50 border-yellow-500/30 text-yellow-900 dark:bg-slate-900/50 dark:border-yellow-500/30 dark:text-yellow-200",
    danger:
      "bg-red-50 border-red-500/30 text-red-900 dark:bg-slate-900/50 dark:border-red-500/30 dark:text-red-200",
  };

  return (
    <div
      className={`p-6 rounded-lg border my-8 backdrop-blur-sm ${variants[variant]}`}
    >
      <h4 className={`font-semibold mb-3 flex items-center gap-2`}>
        <Icon className="h-5 w-5" /> {title}
      </h4>
      <div className="text-sm prose prose-sm dark:prose-invert prose-p:text-inherit prose-ul:text-inherit prose-li:text-inherit">
        {children}
      </div>
    </div>
  );
};

const KeyTakeawayCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10 p-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30">
    <h3 className="text-xl font-bold text-primary dark:text-teal-400 mb-4">
      {title}
    </h3>
    <ul className="space-y-3 text-gray-700 dark:text-slate-300">{children}</ul>
  </div>
);

const SectionWrapper = ({
  id,
  onVisible,
  children,
}: {
  id: string;
  onVisible: (id: string) => void;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -60% 0px" });

  useEffect(() => {
    if (isInView) {
      onVisible(id);
    }
  }, [isInView, id, onVisible]);

  return (
    <section ref={ref} id={id} className="mb-16 scroll-mt-24">
      {children}
    </section>
  );
};

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      <Header />
      <main>
        <section className="relative py-10 md:py-10 overflow-hidden bg-gray-50 dark:bg-slate-900">
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80rem] h-[80rem] bg-radial-gradient from-primary/10 dark:from-teal-500/10 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-teal-500/20 blur-xl"></div>
                <Scale className="relative h-12 w-12 text-primary dark:text-teal-300" />
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-slate-400">
                Your agreement with UEIEP. This document governs your use of our
                platform.
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <aside className="lg:col-span-3 lg:sticky top-24 self-start hidden lg:block">
                <nav>
                  <ul className="space-y-2">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                            activeSection === section.id
                              ? "text-primary dark:text-teal-400 font-semibold"
                              : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <motion.div
                            className="w-1 h-1 rounded-full bg-primary dark:bg-teal-400"
                            animate={{
                              scale: activeSection === section.id ? 2.5 : 1,
                              opacity: activeSection === section.id ? 1 : 0.5,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <motion.div
                className="lg:col-span-9 p-8 sm:p-12 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <article className="prose prose-lg max-w-none dark:prose-invert prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4 prose-a:text-primary hover:prose-a:underline dark:prose-p:text-slate-400 dark:prose-headings:text-slate-100 dark:prose-strong:text-slate-200 dark:prose-h2:border-slate-800 dark:prose-a:text-teal-400">
                  {sections.map((section) => (
                    <SectionWrapper
                      key={section.id}
                      id={section.id}
                      onVisible={setActiveSection}
                    >
                      {section.id === "acceptance" && (
                        <>
                          <h2>Acceptance of Terms</h2>
                          <KeyTakeawayCard title="Key Takeaways">
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                You must be 18+ and provide accurate
                                information.
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                Using our platform means you agree to these
                                rules.
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                We may update these terms; we will notify you of
                                major changes.
                              </span>
                            </li>
                          </KeyTakeawayCard>
                          <p>
                            By creating an account and using the Universal
                            Employment & Income Empowerment Platform ("UEIEP"),
                            you agree to be bound by these Terms of Service. If
                            you do not agree, you may not use our platform.
                          </p>
                        </>
                      )}
                      {section.id === "overview" && (
                        <>
                          <h2>Platform Overview</h2>
                          <KeyTakeawayCard title="Key Takeaways">
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                We provide tools for earning via daily tasks and
                                AI content.
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                A 4-level referral system offers passive income
                                potential.
                              </span>
                            </li>
                          </KeyTakeawayCard>
                          <p>
                            UEIEP provides tools and opportunities to earn
                            income through AI-generated content creation, daily
                            video engagement tasks, and a multi-level referral
                            network. Our goal is to empower Admins with
                            sustainable digital income streams.
                          </p>
                        </>
                      )}
                      {section.id === "responsibilities" && (
                        <>
                          <h2>Admin Responsibilities</h2>
                          <KeyTakeawayCard title="Key Takeaways">
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                Complete your tasks honestly and maintain your
                                Social Media channel.
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                              <span>
                                Keep your account secure and do not use bots or
                                create fake accounts.
                              </span>
                            </li>
                          </KeyTakeawayCard>
                          <p>
                            You are responsible for all activity on your
                            account. This includes completing daily assignments
                            genuinely, following Social Media's community
                            guidelines with the AI content we provide, and
                            maintaining the confidentiality of your login
                            credentials.
                          </p>
                          <Callout
                            icon={AlertTriangle}
                            title="Prohibited Actions"
                            variant="danger"
                          >
                            <p>
                              Engaging in fraudulent activities such as using
                              bots, creating multiple accounts for one person,
                              or manipulating the referral system is strictly
                              forbidden and will result in immediate account
                              termination and forfeiture of all earnings.
                            </p>
                          </Callout>
                          <Callout
                            icon={AlertTriangle}
                            title="Compliance Notice: One ID per device rule"
                            variant="warning"
                          >
                            <ul>
                              <li>
                                Using more than one ID on the same device
                                (laptop, desktop, Android, or any other) is
                                strictly prohibited.
                              </li>
                              <li>
                                Our system automatically detects multiple logins
                                and will take action.
                              </li>
                              <li>
                                If violated, the primary (mother) ID will be
                                blocked permanently.
                              </li>
                              <li>
                                This rule ensures fair usage, platform
                                integrity, and smooth earnings for all users.
                              </li>
                            </ul>
                            <p className="mt-4">
                              Please follow this guideline carefully to avoid
                              account issues and maintain a transparent earning
                              journey.
                            </p>
                          </Callout>
                        </>
                      )}
                      {section.id === "payments" && (
                        <>
                          <h2>Income & Payments</h2>
                          <p>
                            Earnings are calculated based on completed tasks,
                            Social Media revenue share, and referral
                            commissions. Withdrawals are processed via UPI. We
                            do not guarantee any specific level of income.
                          </p>
                          <Callout
                            icon={Scale}
                            title="Platform Contribution Policy: Social Media Earnings"
                            variant="info"
                          >
                            <ul>
                              <li>
                                Users must deposit 5% of their social media
                                earnings to the platform account within 5
                                working days of receiving payment.
                              </li>
                              <li>
                                This contribution ensures that downline income
                                is distributed to uplines after 7 working days,
                                maintaining transparency and timely payouts.
                              </li>
                              <li>
                                If the contribution is not made within 5 working
                                days, the user will not receive any commission
                                for that month.
                              </li>
                              <li>
                                If the contribution is still not made between
                                Day 6 and Day 10, the user's ID will be blocked
                                within 10 working days.
                              </li>
                            </ul>
                            <p className="mt-4">
                              Please follow this policy strictly to keep your
                              account active and ensure smooth income flows
                              across all levels.
                            </p>
                          </Callout>
                        </>
                      )}
                      {section.id === "referral" && (
                        <>
                          <h2>Referral Program</h2>
                          <p>
                            You can earn commissions from the activity of Admins
                            you refer, up to 5 levels deep. The commission
                            structure is detailed on our platform.
                            Self-referrals are prohibited.
                          </p>
                        </>
                      )}
                      {section.id === "termination" && (
                        <>
                          <h2>Account Termination</h2>
                          <p>
                            We reserve the right to suspend or terminate
                            accounts that violate these terms. A warning system
                            is in place, but severe violations will lead to
                            immediate termination.
                          </p>
                        </>
                      )}
                      {section.id === "contact" && (
                        <>
                          <h2>Contact Information</h2>
                          <p>
                            For any legal inquiries or questions regarding these
                            terms, please contact our legal department at{" "}
                            <a href="mailto:legal@ueiep.com">
                              legal@veranix-ai.com
                            </a>
                            .
                          </p>
                        </>
                      )}
                    </SectionWrapper>
                  ))}
                </article>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}