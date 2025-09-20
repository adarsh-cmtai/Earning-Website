"use client"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { motion } from "framer-motion"
import { AlertTriangle, Ban, CheckCircle, Clock, DollarSign, FileText, LifeBuoy, Receipt, ShieldCheck, XCircle } from "lucide-react"
import type { ElementType, ReactNode } from "react"

interface PolicySectionProps {
  icon: ElementType;
  title: string;
  children: ReactNode;
}

const PolicySection = ({ icon: Icon, title, children }: PolicySectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 md:p-8"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-primary/10 dark:bg-teal-500/10 text-primary dark:text-teal-300 p-3 rounded-full">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">{title}</h2>
    </div>
    <div className="prose prose-lg max-w-none dark:prose-invert prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:marker:text-primary dark:prose-p:text-slate-400 dark:prose-headings:text-slate-100 dark:prose-strong:text-slate-200 dark:prose-ul:marker:text-teal-400">
      {children}
    </div>
  </motion.div>
);

type InfoBoxVariant = 'info' | 'warning' | 'danger';

interface InfoBoxProps {
    icon: ElementType;
    title?: string;
    children: ReactNode;
    variant?: InfoBoxVariant;
}

const InfoBox = ({ icon: Icon, title, children, variant = "info" }: InfoBoxProps) => {
  const variants: Record<InfoBoxVariant, string> = {
    info: "border-sky-500 bg-sky-50 dark:bg-sky-500/5 text-sky-300",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/5 text-yellow-300",
    danger: "border-red-500 bg-red-50 dark:bg-red-500/5 text-red-300",
  };
  return (
    <div className={`my-6 border-l-4 p-4 rounded-r-lg ${variants[variant]}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
        <div>
          {title && <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">{title}</h4>}
          <div className="text-sm text-gray-700 dark:text-slate-300">{children}</div>
        </div>
      </div>
    </div>
  );
};


export default function RefundPolicyPage() {
  const principles = [
    { icon: XCircle, title: "Earnings Are Final", text: "Income generated and withdrawn from the platform is considered final and non-refundable.", color: "red" },
    { icon: Clock, title: "Service-Based Policy", text: "This policy primarily applies to any specific paid services or subscriptions, should they be introduced in the future.", color: "sky" },
    { icon: ShieldCheck, title: "Case-by-Case Review", text: "All eligible refund requests for paid services are reviewed individually to ensure fairness and compliance.", color: "teal" },
  ];

  const getPrincipleColors = (color: string) => {
    switch (color) {
      case 'red': return { bg: 'bg-red-500/10', text: 'text-red-500 dark:text-red-400' };
      case 'sky': return { bg: 'bg-sky-500/10', text: 'text-sky-500 dark:text-sky-400' };
      case 'teal': return { bg: 'bg-teal-500/10', text: 'text-teal-500 dark:text-teal-400' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-500 dark:text-gray-400' };
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white font-sans">
      <Header />
      <main>
        <section className="py-10 md:py-10 relative text-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-50/40 dark:from-teal-900/30 via-white dark:via-slate-950 to-white dark:to-slate-950"></div>
          <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6 bg-primary/10 dark:bg-teal-500/10 border border-primary/20 dark:border-teal-500/20">
              <DollarSign className="h-10 w-10 text-primary dark:text-teal-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Refund & Cancellation Policy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-4 max-w-3xl mx-auto">
              Clear, transparent, and fair. Understand our approach to refunds
              and account finances.
            </p>
            <p className="text-gray-500 dark:text-slate-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        </section>

        <section className="py-10 md:py-10">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Our Core Principles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {principles.map((item, index) => {
                  const colors = getPrincipleColors(item.color);
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 text-center transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div
                        className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <item.icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <PolicySection icon={FileText} title="1. General Policy">
              <p>
                The Universal Employment & Income Empowerment Platform (UEIEP)
                is built on a performance-based earning model. This means that
                the income you generate through daily tasks, Social Media
                content, and referrals is earned income. This policy outlines
                how we handle finances related to your account.
              </p>
              <InfoBox icon={CheckCircle} title="Scope of this Policy">
                This policy applies to all registered Users and covers all
                financial aspects of the platform, including earned income and
                any future paid services. We reserve the right to update this
                policy and will notify Users of any significant changes.
              </InfoBox>
            </PolicySection>

            <PolicySection icon={Receipt} title="2. Earnings & Withdrawals">
              <h3>Non-Refundable Earnings</h3>
              <p>
                Once your earnings are successfully processed and transferred
                from your UEIEP wallet to your verified UPI ID, the transaction
                is considered final and cannot be refunded or reversed. Please
                ensure your payment details are correct before initiating any
                withdrawal.
              </p>
              <h3>Failed Withdrawals</h3>
              <p>
                If a withdrawal fails due to incorrect UPI information or
                technical issues, the funds will be automatically credited back
                to your UEIEP account balance. If the amount does not reflect
                within 7 business days, please contact our support team with the
                transaction details for assistance.
              </p>
              <InfoBox
                icon={AlertTriangle}
                title="Fraudulent Activity"
                variant="warning"
              >
                Any earnings acquired through system manipulation, fraudulent
                referrals, or any other violation of our Terms of Service will
                be forfeited. Such funds are not eligible for withdrawal and
                will be permanently removed from the account.
              </InfoBox>
            </PolicySection>

            <PolicySection icon={Ban} title="3. Policy on Paid Services">
              <p>
                Currently, UEIEP is a free-to-use platform. We do not charge any
                registration or subscription fees. However, should we introduce
                optional paid services or premium features in the future, a
                specific refund policy for those services will be clearly stated
                at the time of purchase.
              </p>
            </PolicySection>

            <PolicySection icon={XCircle} title="4. Account Termination">
              <h3>Termination by UEIEP</h3>
              <p>
                If your account is terminated by our team due to a violation of
                our community guidelines or terms of service, any pending
                earnings and unused service credits (if applicable) will be
                forfeited and are not eligible for a refund or withdrawal.
              </p>
              <h3>Voluntary Account Closure</h3>
              <p>
                If you choose to voluntarily close your account, you will be
                prompted to withdraw any remaining balance that meets the
                minimum withdrawal threshold. Once the account is closed, no
                further claims can be made.
              </p>
            </PolicySection>

            <PolicySection icon={LifeBuoy} title="5. How to Contact Us">
              <p>
                For any questions regarding this policy or issues with your
                account finances, please reach out to our dedicated support
                team.
              </p>
              <ol>
                <li>
                  1. Email our support desk at{" "}
                  <strong>support@veranix-ai.com</strong>.
                </li>
                <li>
                  2. Include your Admin ID and a clear description of your
                  query.
                </li>
                <li>
                  3. Our team aims to respond to all financial inquiries within
                  3-5 business days.
                </li>
              </ol>
            </PolicySection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}