"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, Mail, Smartphone } from "lucide-react"
import { useRef, ChangeEvent, KeyboardEvent, useState, useEffect } from "react";
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { sendOtp, verifyOtp, resetAuthState } from "@/lib/redux/features/authSlice"
import { unwrapResult } from "@reduxjs/toolkit"

interface OTPVerificationStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function OTPVerificationStep({ formData, updateFormData, onNext, onBack }: OTPVerificationStepProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, isOtpSent, isOtpVerified } = useSelector((state: RootState) => state.auth)

  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""))
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""))
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [timer, setTimer] = useState(60);

  const emailOtpInputs = useRef<(HTMLInputElement | null)[]>([])
  const mobileOtpInputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    dispatch(resetAuthState())
    handleSendOtp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = async () => {
    try {
      await dispatch(sendOtp({ email: formData.email, mobile: formData.mobile })).then(unwrapResult)
      toast.success("OTP sent successfully!")
      setTimer(60);
    } catch (err: any) {
      toast.error(err || "Failed to send OTP.")
    }
  }
  
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number, type: 'email' | 'mobile') => {
    const { value } = e.target
    if (/[^0-9]/.test(value)) return
    
    const setOtp = type === 'email' ? setEmailOtp : setMobileOtp;
    const otp = type === 'email' ? emailOtp : mobileOtp;
    const inputs = type === 'email' ? emailOtpInputs : mobileOtpInputs;

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number, type: 'email' | 'mobile') => {
    const otp = type === 'email' ? emailOtp : mobileOtp;
    const inputs = type === 'email' ? emailOtpInputs : mobileOtpInputs;

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const fullEmailOtp = emailOtp.join("")
    const fullMobileOtp = mobileOtp.join("")

    if (fullEmailOtp.length !== 6 || fullMobileOtp.length !== 6) {
        toast.error("Please enter both 6-digit OTPs.")
        return;
    }

    try {
        await dispatch(verifyOtp({ 
            email: formData.email, 
            mobile: formData.mobile, 
            emailOtp: fullEmailOtp, 
            mobileOtp: fullMobileOtp 
        })).then(unwrapResult);
        toast.success("OTP verified successfully!")
    } catch (err: any) {
        toast.error(err || "OTP verification failed.")
    }
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const handlePasswordChange = (password: string) => {
    updateFormData({ password })
    setPasswordStrength(calculatePasswordStrength(password))
  }

  const handleContinue = () => {
    if (!formData.password || passwordStrength < 75) {
      toast.error("Please create a strong password to continue.")
      return;
    }
    onNext();
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
      <AnimatePresence mode="wait">
        {!isOtpVerified ? (
          <motion.div key="otp-phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="text-center text-sm text-gray-600 dark:text-slate-400">
                An OTP has been sent to your email <span className="font-semibold text-primary dark:text-teal-400">{formData.email}</span> and mobile <span className="font-semibold text-primary dark:text-teal-400">{formData.mobile}</span>.
            </div>

            <div className="p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800 dark:text-slate-200"><Mail size={18}/> Email OTP</label>
                <div className="flex justify-center gap-2 sm:gap-3">
                {emailOtp.map((digit, index) => (
                    <input key={index} ref={(el) => { emailOtpInputs.current[index] = el }} type="text" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(e, index, 'email')} onKeyDown={(e) => handleKeyDown(e, index, 'email')}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-teal-500 rounded-md"/>
                ))}
                </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-800 dark:text-slate-200"><Smartphone size={18}/> Mobile OTP</label>
                <div className="flex justify-center gap-2 sm:gap-3">
                {mobileOtp.map((digit, index) => (
                    <input key={index} ref={(el) => { mobileOtpInputs.current[index] = el }} type="text" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(e, index, 'mobile')} onKeyDown={(e) => handleKeyDown(e, index, 'mobile')}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-teal-500 rounded-md"/>
                ))}
                </div>
            </div>

            <Button onClick={handleVerifyOtp} disabled={isLoading} className="w-full font-semibold bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white">
              {isLoading ? "Verifying..." : "Verify Both OTPs"}
            </Button>
            
            <div className="text-center text-xs text-gray-500 dark:text-slate-500">
                {timer > 0 ? `You can resend OTP in ${timer}s` : (
                    <button onClick={handleSendOtp} disabled={isLoading} className="text-primary dark:text-teal-400 hover:underline">
                        {isLoading ? "Sending..." : "Resend OTP"}
                    </button>
                )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="password-phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-slate-100">Verification Complete!</h3>
                <p className="mt-1 text-gray-600 dark:text-slate-400">Now, create a secure password for your account.</p>
            </div>
            
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter a strong password" value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full pr-10 bg-gray-100 dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-1 focus:ring-primary dark:focus:ring-teal-500 p-3 rounded-md"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <motion.div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-sky-500" style={{ width: `${passwordStrength}%` }} />
                </div>
                <ul className="text-xs grid grid-cols-2 gap-x-4 gap-y-1 text-gray-500 dark:text-slate-400">
                  <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? "text-green-600 dark:text-teal-400" : ""}`}><CheckCircle size={14} /> 8+ characters</li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-green-600 dark:text-teal-400" : ""}`}><CheckCircle size={14} /> 1 uppercase</li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? "text-green-600 dark:text-teal-400" : ""}`}><CheckCircle size={14} /> 1 number</li>
                  <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600 dark:text-teal-400" : ""}`}><CheckCircle size={14} /> 1 special char</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="w-full text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800" disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
         {isOtpVerified && (
            <Button onClick={handleContinue} className="w-full font-semibold bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-teal-600 dark:hover:bg-teal-700 dark:text-white">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        )}
      </motion.div>
    </motion.div>
  )
}