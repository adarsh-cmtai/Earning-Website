// components/landing/footer.tsx

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
                UEIEP
              </span>
            </div>
            <p className="text-base leading-relaxed mb-6 max-w-sm">
              Your gateway to digital income success. Empowering individuals
              through technology and community.
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
                  Pages
                </h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
                  Product
                </h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <Link
                      href="/#features"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
                  Legal
                </h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund"
                      className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                    >
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-primary dark:text-teal-400 flex-shrink-0" />
                <span>
                  CIN: u62011mn2025ptc015390, GSTIN: 14AALCV3143M1Z2 Email:
                  ai-veranix1@veranix-ai.com, www.veranix-ai.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary dark:text-teal-400 flex-shrink-0" />
                <a
                  href="mailto:support@ueiep.com"
                  className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                >
                  ai-veranix1@veranix-ai.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-primary dark:text-teal-400 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="hover:text-primary dark:hover:text-teal-400 transition-colors"
                >
                  +91 7629037269
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200/80 dark:border-slate-800 mt-16 pt-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} UEIEP. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/terms"
              className="hover:text-primary dark:hover:text-teal-400 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary dark:hover:text-teal-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}