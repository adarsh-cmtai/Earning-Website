"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { logoutUser } from "@/lib/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Sun, Moon, LayoutDashboard, User, Settings, LogOut, Phone, Mail, Sparkles, Github, Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blogs" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: Facebook },
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "GitHub", icon: Github },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [hoveredPath, setHoveredPath] = useState(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      setHoveredPath(pathname);
    }
  }, [pathname, isMenuOpen]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const handleLinkClick = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully.", { id: toastId });
      router.push('/login');
    } catch (error) {
      toast.error("Logout failed. Please try again.", { id: toastId });
    }
  };

  const UserNav = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-transparent hover:border-teal-500/50 transition-colors duration-300">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.fullName || 'User'} />
            <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">{user?.fullName}</p><p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user?.email}</p></div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.role === 'admin' || user?.adminRole ? (<DropdownMenuItem asChild><Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Panel</Link></DropdownMenuItem>) : (<>
            <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
        </>)}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10"><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className={`sticky top-0 z-50 w-full bg-white dark:bg-slate-900 transition-shadow duration-300 ${isScrolled ? "shadow-lg" : ""}`}>
      <div className={`bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50 transition-all duration-300 ${isScrolled ? "max-h-0 opacity-0 py-0" : "max-h-12 py-2"}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1 font-semibold">
              <Sparkles className="h-4 w-4 text-teal-500" />
              <span>Special launch offer ends this week!</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a href="mailto:support@ueiep.com" className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"><Mail size={14} /><span>ai-veranix1@veranix-ai.com</span></a>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-3">
                {socialLinks.map(link => (
                  <a key={link.label} href={link.href} aria-label={link.label} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors hover:scale-110">
                    <link.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold text-xl">U</span>
            </motion.div>
            <span className="font-extrabold text-2xl text-gray-900 dark:text-white tracking-tight">UEIEP</span>
          </Link>
          <nav onMouseLeave={() => setHoveredPath(pathname)} className="hidden lg:flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700/50 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onMouseEnter={() => setHoveredPath(link.href)} className={`relative px-5 py-2 text-sm transition-colors duration-300 ${isActive ? 'font-semibold text-gray-800 dark:text-white' : 'font-medium text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white'}`}>
                  <span className="relative z-10">{link.label}</span>
                  {hoveredPath === link.href && (<motion.div className="absolute inset-0 rounded-full bg-white dark:bg-slate-700/50" layoutId="active-nav-pill" transition={{ type: "spring", stiffness: 350, damping: 30 }} />)}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (<UserNav />) : (<>
                  <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full px-5 shadow-lg shadow-teal-500/30 transition-transform hover:scale-105" asChild><Link href="/register">Join Now</Link></Button>
              </>)}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></Button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg lg:hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
              <div className="flex items-center justify-between h-20"><Link href="/" onClick={handleLinkClick} className="flex items-center space-x-3"><div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-xl">U</span></div></Link><Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></Button></div>
              <motion.nav initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="flex-grow flex flex-col items-center justify-center gap-6">
                {navLinks.map((link) => (<motion.div key={link.href} variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}><Link href={link.href} onClick={handleLinkClick} className={`text-3xl font-bold tracking-tight transition-colors ${pathname === link.href ? "text-teal-500 dark:text-teal-400" : "text-gray-800 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400"}`}>{link.label}</Link></motion.div>))}
              </motion.nav>
              <div className="flex flex-col space-y-4 py-8">
                {isAuthenticated ? (<Button size="lg" onClick={() => { handleLogout(); handleLinkClick(); }} className="bg-red-500 hover:bg-red-600 text-white">Log Out</Button>) : (<div className="grid grid-cols-2 gap-4"><Button variant="outline" size="lg" asChild><Link href="/login" onClick={handleLinkClick}>Login</Link></Button><Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" asChild><Link href="/register" onClick={handleLinkClick}>Join Now</Link></Button></div>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}