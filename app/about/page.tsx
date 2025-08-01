"use client";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Users,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Target,
  ChevronDown,
  Quote as QuoteIcon,
  Bot,
  Wallet,
  BarChart3,
  Server,
} from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "/images/home/testimonial1.jpg",
    description: "Visionary leader with 15+ years in AI and digital platforms.",
  },
  {
    name: "Priya Sharma",
    role: "Chief Technology Officer",
    image: "/images/home/testimonial1.jpg",
    description:
      "AI research pioneer and specialist in generative content systems.",
  },
  {
    name: "Amit Patel",
    role: "Head of Operations",
    image: "/images/home/testimonial1.jpg",
    description:
      "Digital marketing ecosystem expert ensuring seamless user experience.",
  },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "To democratize income opportunities through AI-powered content and strategic networking.",
    bgUrl: "/images/home/testimonial1.jpg",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Connecting like-minded individuals who support each other's growth and success.",
    bgUrl: "/images/home/testimonial1.jpg",
  },
  {
    icon: Shield,
    title: "Unwavering Trust",
    description:
      "Your data and earnings are protected with bank-grade security and complete transparency.",
    bgUrl: "/images/home/testimonial1.jpg",
  },
];

const storyChapters = [
  {
    icon: Lightbulb,
    title: "The Genesis",
    year: "2023",
    text: "Born from a simple observation: millions of talented individuals lack access to sustainable digital income. We envisioned a platform combining AI with community power.",
  },
  {
    icon: Rocket,
    title: "The Launch",
    year: "2023",
    text: "UEIEP was launched to create a platform where anyone can build multiple income streams, focusing on a decentralized, community-driven future.",
  },
  {
    icon: Heart,
    title: "The Impact",
    year: "Today",
    text: "Proudly serving thousands of members across India, distributing significant earnings through a transparent, automated system that puts users first.",
  },
];

const techPillars = [
  {
    icon: Bot,
    title: "AI Video Suite",
    description: "Cutting-edge tools that turn ideas into high-quality videos.",
  },
  {
    icon: Wallet,
    title: "Secure Payouts",
    description: "Automated, daily transactions with bank-grade security.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Transparent dashboard to track earnings and network growth.",
  },
  {
    icon: Server,
    title: "Scalable Infrastructure",
    description: "Robust backend ready to support millions of users.",
  },
];

const AnimatedCounter = ({ to, isCurrency = false }: { to: number, isCurrency?: boolean }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    isCurrency
      ? `₹${Math.round(latest).toLocaleString("en-IN")}`
      : Math.round(latest).toLocaleString("en-IN")
  );
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) animate(count, to, { duration: 2.5, ease: "easeOut" });
  }, [inView, count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const TeamCard = ({ member }: { member: (typeof team)[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative w-full rounded-2xl border border-slate-200/20 dark:border-slate-800/50 bg-slate-100/5 dark:bg-slate-900/20 p-8 text-center transition-all duration-300 hover:border-slate-300/30 dark:hover:border-slate-700/50 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at ${coords.x}px ${coords.y}px, rgba(20, 184, 166, 0.1), transparent 80%)`,
        }}
      />
      <Image
        src={member.image}
        alt={member.name}
        width={112}
        height={112}
        className="w-28 h-28 rounded-full mx-auto mb-5 object-cover ring-4 ring-white/10 transition-all duration-300 group-hover:ring-primary/50"
      />
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        {member.name}
      </h3>
      <p className="text-primary dark:text-teal-400 font-medium mb-3">
        {member.role}
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {member.description}
      </p>
    </div>
  );
};

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState(values[0]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "start start"],
  });


  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Header />
      <main>
        <section
          ref={heroRef}
          className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden"
        >
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
              alt="A team working together in a modern office"
              fill
              priority
              quality={100}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          </motion.div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white animate-gradient bg-gradient-to-r from-teal-300 via-sky-300 to-purple-300 bg-300% bg-clip-text text-transparent">
                Architecture of Empowerment
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                We're not just building a platform; we're engineering a new
                digital economy powered by community and shared opportunity.
              </p>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 text-slate-400" />
          </motion.div>
        </section>

        <section className="py-12 md:py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop" alt="Group of diverse people connecting" width={600} height={400} className="rounded-2xl object-cover" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Our Philosophy: Bridging the Aspiration Gap</h2>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">In a digitally connected India, talent is everywhere, but opportunity is not. We saw a gap between the aspirations of millions and the accessible platforms to realize them. UEIEP was born to be that bridge.</p>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">We believe in democratizing digital success, providing powerful AI tools and a robust community framework that empowers anyone, anywhere, to build a sustainable online income stream.</p>
                    </motion.div>
                </div>
            </div>
        </section>

        <section ref={timelineRef} className="py-12 md:py-12 bg-gray-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              <div className="lg:sticky top-28">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  Our Journey, Our Promise
                </h2>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  From a simple idea to a thriving community, our story is one
                  of innovation, dedication, and a relentless focus on
                  empowering our members.
                </p>
              </div>
              <div className="relative">
                <motion.div className="absolute left-6 top-0 bottom-0 w-px origin-top">
                  <svg width="2" height="100%" className="h-full">
                    <motion.line
                      x1="1" y1="0" x2="1" y2="100%"
                      stroke="url(#gradient)" strokeWidth="2"
                      style={{ pathLength: timelineProgress }}
                    />
                    <defs>
                      <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="800">
                        <stop stopColor="#14b8a6" />
                        <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
                <div className="space-y-20">
                  {storyChapters.map((chapter) => (
                    <motion.div
                      key={chapter.title}
                      className="relative pl-20"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <div className="absolute left-0 top-1 flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-primary/50 shadow-md">
                        <chapter.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-mono text-slate-500 mb-2 block">
                        {chapter.year}
                      </span>
                      <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        {chapter.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {chapter.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-12 bg-slate-800 text-white">
            <div className="container mx-auto px-4">
                <motion.div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12" initial={{opacity: 0, y: 50}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.8, ease: "easeOut"}}>
                    <div className="md:col-span-1 flex justify-center">
                        <Image src="/images/home/testimonial1.jpg" alt="Rajesh Kumar" width={160} height={160} className="rounded-full object-cover ring-4 ring-primary/50" />
                    </div>
                    <div className="md:col-span-2 text-center md:text-left">
                        <QuoteIcon className="w-16 h-16 text-primary/30 mb-4" />
                        <blockquote className="text-2xl md:text-3xl font-medium leading-snug">
                            We didn't just build a tool; we forged a movement. A movement of creators, earners, and dreamers who are reshaping their own futures, one day at a time.
                        </blockquote>
                        <p className="mt-6 text-xl font-bold">Rajesh Kumar</p>
                        <p className="text-primary">Founder & CEO, UEIEP</p>
                    </div>
                </motion.div>
            </div>
        </section>

        <section className="py-12 md:py-12 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                What Drives Us
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Our core values are the pillars that support our vision and
                guide our every action.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div className="flex flex-col gap-2">
                {values.map((value) => (
                  <div
                    key={value.title}
                    onMouseEnter={() => setHoveredValue(value)}
                    className="relative p-6 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    {hoveredValue.title === value.title && (
                      <motion.div
                        layoutId="active-value"
                        className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-slate-800"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-4">
                      <value.icon
                        className={`h-7 w-7 transition-colors duration-300 ${
                          hoveredValue.title === value.title
                            ? "text-primary"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {value.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredValue.title}
                  className="relative h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1.05, 1] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image
                      src={hoveredValue.bgUrl}
                      alt={hoveredValue.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 p-8 text-white">
                    <h3 className="text-2xl font-bold">
                      {hoveredValue.title}
                    </h3>
                    <p className="mt-2 text-slate-300">
                      {hoveredValue.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-12 bg-gray-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="lg:pr-12">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Built on Trust, Powered by Innovation</h2>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Our platform is more than just a concept. It's a robust technological ecosystem engineered for performance, security, and transparency.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {techPillars.map((pillar, index) => (
                            <motion.div key={pillar.title} className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50" initial={{opacity: 0, y: 30}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: index * 0.1}}>
                                <pillar.icon className="h-8 w-8 text-primary mb-4" />
                                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">{pillar.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{pillar.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className="relative py-12 md:py-12 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] dark:invert opacity-40"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                The Architects of Empowerment
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-1">
                Meet the passionate individuals dedicated to building your
                digital future.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {team.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-16 bg-gray-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Our Impact in Numbers</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-4">We measure our success by the success of our community. Here's a snapshot of what we've achieved together.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    <div className="p-8 text-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                        <p className="text-5xl font-bold text-primary dark:text-teal-400"><AnimatedCounter to={10000} />+</p>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Members Joined</p>
                    </div>
                    <div className="p-8 text-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                        <p className="text-5xl font-bold text-primary dark:text-teal-400"><AnimatedCounter to={5000} isCurrency={true} />+</p>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Earnings Distributed</p>
                    </div>
                    <div className="p-8 text-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                        <p className="text-5xl font-bold text-primary dark:text-teal-400"><AnimatedCounter to={25} />+</p>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">States Covered</p>
                    </div>
                     <div className="p-8 text-center bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                        <p className="text-5xl font-bold text-primary dark:text-teal-400">100%</p>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Automated Daily Payouts</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="relative p-12 text-center bg-slate-900 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-primary/20 [mask-image:radial-gradient(100%_100%_at_100%_0,white,transparent)]"></div>
                <div className="absolute inset-0 bg-accent/20 [mask-image:radial-gradient(100%_100%_at_0%_100,white,transparent)]"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Ready to Write Your Success Story?
                </h2>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
                  Join a community that's built to help you grow, earn, and succeed in the digital age.
                </p>
                <div className="mt-8">
                  <Link
                    href="/register"
                    className="inline-block px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-primary to-accent rounded-full shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105"
                  >
                    Start Your Journey Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}