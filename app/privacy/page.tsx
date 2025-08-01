"use client"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { motion, useInView } from "framer-motion"
import { UserCheck, AlertTriangle, Database, Eye, Lock, Shield } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use-information", title: "3. How We Use Information" },
  { id: "information-sharing", title: "4. Information Sharing" },
  { id: "data-security", title: "5. Data Security" },
  { id: "your-rights", title: "6. Your Rights & Choices" },
  { id: "contact", title: "7. Contact & Updates" },
]

const Callout = ({
  icon: Icon,
  title,
  children,
  variant = "info",
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  variant?: "info" | "danger"
}) => {
  const variants = {
    info: "bg-sky-50 border-sky-500/30 text-sky-900 dark:bg-slate-900/50 dark:border-sky-500/30 dark:text-sky-200",
    danger: "bg-red-50 border-red-500/30 text-red-900 dark:bg-slate-900/50 dark:border-red-500/30 dark:text-red-200",
  }

  return (
    <div className={`p-6 rounded-lg border my-8 backdrop-blur-sm ${variants[variant]}`}>
      <h4 className={`font-semibold mb-3 flex items-center gap-2`}>
        <Icon className="h-5 w-5" /> {title}
      </h4>
      <div className="text-sm prose prose-sm dark:prose-invert prose-p:text-inherit">{children}</div>
    </div>
  )
}

const SectionWrapper = ({ id, onVisible, children }: { id: string, onVisible: (id: string) => void, children: React.ReactNode }) => {
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
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      <Header />
      <main>
        <section className="relative py-8 md:py-8 overflow-hidden bg-gray-50 dark:bg-slate-900">
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
                <Shield className="relative h-12 w-12 text-primary dark:text-teal-300" />
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-slate-400">Our commitment to protecting your data and upholding your privacy.</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <aside className="lg:col-span-3 lg:sticky top-24 self-start hidden lg:block">
                <nav>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-200 mb-4">On this page</h3>
                  <ul className="space-y-2">
                    {sections.map(section => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                            activeSection === section.id ? "text-primary dark:text-teal-400 font-semibold" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <motion.div
                            className="w-px h-4 bg-primary dark:bg-teal-400"
                            animate={{ scaleY: activeSection === section.id ? 1 : 0, opacity: activeSection === section.id ? 1 : 0 }}
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
                className="lg:col-span-9"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="p-8 sm:p-12 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-slate-800">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                            <Eye className="h-8 w-8 text-primary dark:text-teal-400" /> Privacy at a Glance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Lock, title: "Data Encryption", text: "All personal data is encrypted using industry-standard protocols." },
                                { icon: UserCheck, title: "Your Control", text: "You can access, modify, or delete your personal data anytime." },
                                { icon: Database, title: "No Data Sales", text: "We never sell your personal information to third parties." }
                            ].map(summary => (
                                <div key={summary.title} className="p-6 bg-gray-100 dark:bg-slate-800/50 rounded-lg text-center border border-gray-200 dark:border-slate-700">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-gradient-to-br dark:from-teal-500/20 dark:to-sky-500/20 mb-3">
                                        <summary.icon className="h-6 w-6 text-primary dark:text-teal-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-1">{summary.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-slate-400">{summary.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <article className="prose prose-lg max-w-none dark:prose-invert prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4 prose-a:text-primary hover:prose-a:underline dark:prose-p:text-slate-400 dark:prose-headings:text-slate-100 dark:prose-strong:text-slate-200 dark:prose-h2:border-slate-800 dark:prose-a:text-teal-400">
                      {sections.map(section => (
                        <SectionWrapper key={section.id} id={section.id} onVisible={setActiveSection}>
                          {section.id === 'introduction' && ( <><h2>Introduction</h2><p>This Privacy Policy explains how UEIEP ("we," "us," or "our") collects, uses, and discloses your information. Your privacy is of utmost importance to us, and this policy outlines our commitment to protecting it.</p></> )}
                          {section.id === 'information-we-collect' && ( <><h2>Information We Collect</h2><p>To provide our service, we collect information you provide directly (e.g., name, contact, payment details), as well as data generated from your use of the platform (e.g., activity, analytics, device info).</p></> )}
                          {section.id === 'how-we-use-information' && ( <><h2>How We Use Your Information</h2><p>Your data is used primarily to operate the platform: managing your account, processing payments, providing support, and calculating referral commissions. We also use anonymized data to improve our services and features.</p></> )}
                          {section.id === 'information-sharing' && (
                            <>
                              <h2>Information Sharing</h2>
                              <Callout icon={AlertTriangle} title="Our Core Promise" variant="danger">
                                  <p>We do not and will not sell, rent, or trade your personal information to any third party for marketing purposes. This is a core principle of our platform.</p>
                              </Callout>
                              <p>We only share information with trusted service providers essential for our operations (like payment processors) or when legally required to do so.</p>
                            </>
                          )}
                           {section.id === 'data-security' && ( <><h2>Data Security</h2><p>We employ robust technical and operational safeguards, including SSL/TLS encryption for data in transit and AES-256 encryption for data at rest, to protect your information. However, no system is infallible, and we encourage you to use a strong, unique password.</p></> )}
                           {section.id === 'your-rights' && ( <><h2>Your Rights & Choices</h2><p>You have the right to access, correct, or delete your personal data. You can manage most of your information directly through your account settings or by contacting our support team.</p></> )}
                           {section.id === 'contact' && ( <><h2>Contact & Updates</h2><p>If you have any questions about this policy, please contact our Data Protection Officer at <a href="mailto:privacy@ueiep.com">privacy@ueiep.com</a>. We may update this policy periodically and will notify you of any significant changes.</p></> )}
                        </SectionWrapper>
                      ))}
                    </article>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}