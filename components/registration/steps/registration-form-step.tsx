"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { Users, ArrowLeft, ArrowRight, CreditCard, Mail, Smartphone } from "lucide-react"
import { useState } from "react"

interface RegistrationFormStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export function RegistrationFormStep({ formData, updateFormData, onNext, onBack }: RegistrationFormStepProps) {
  const [showUPI, setShowUPI] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Please enter a valid 10-digit mobile number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) onNext()
  }

  const inputClasses = "pl-10 peer bg-gray-100 dark:bg-slate-800/80 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-300 focus:ring-1 focus:ring-primary dark:focus:ring-teal-500 focus:border-primary dark:focus:border-teal-500"
  const errorClasses = "border-red-500/50 focus:ring-red-500 focus:border-red-500"
  const labelClasses = "absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-teal-400 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary dark:peer-[:not(:placeholder-shown)]:text-teal-400"
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 transition-colors group-focus-within:text-primary dark:group-focus-within:text-teal-400"
  
  return (
    <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
        <motion.div variants={itemVariants} className="text-center">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Personal Information</h2>
             <p className="mt-2 text-gray-600 dark:text-slate-400">Please provide your details to create your account.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
            <div className="relative group">
                <Users className={iconClasses} />
                <Input id="fullName" placeholder=" " value={formData.fullName} onChange={(e) => updateFormData({ fullName: e.target.value })} className={`${inputClasses} ${errors.fullName ? errorClasses : ''}`} />
                <Label htmlFor="fullName" className={labelClasses}>Full Name *</Label>
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="relative group">
                    <Mail className={iconClasses} />
                    <Input id="email" type="email" placeholder=" " value={formData.email} onChange={(e) => updateFormData({ email: e.target.value })} className={`${inputClasses} ${errors.email ? errorClasses : ''}`} />
                    <Label htmlFor="email" className={labelClasses}>Email Address *</Label>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                 <div className="relative group">
                    <Smartphone className={iconClasses} />
                    <Input id="mobile" placeholder=" " value={formData.mobile} onChange={(e) => updateFormData({ mobile: e.target.value })} className={`${inputClasses} ${errors.mobile ? errorClasses : ''}`} />
                    <Label htmlFor="mobile" className={labelClasses}>Mobile Number *</Label>
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
            </div>
             <p className="text-xs text-gray-500 dark:text-slate-500 text-center">Your WhatsApp notifications will be sent to this number.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="border-t border-gray-200 dark:border-slate-800 pt-8">
             <AnimatePresence mode="wait">
             {!showUPI ? (
                <motion.div
                    key="add-upi"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-6 text-center bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/80 rounded-xl"
                >
                    <CreditCard className="h-8 w-8 text-primary dark:text-teal-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 dark:text-slate-200">Add UPI for Payments</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 mb-4">This is required for receiving earnings. You can also add it later.</p>
                    <Button variant="outline" onClick={() => setShowUPI(true)} className="text-primary dark:text-teal-400 border-primary/50 dark:border-teal-500/50 bg-primary/10 dark:bg-teal-500/10 hover:bg-primary/20 dark:hover:bg-teal-500/20 hover:text-primary-hover dark:hover:text-teal-300">
                        Add UPI Details
                    </Button>
                </motion.div>
             ) : (
                 <motion.div
                    key="upi-form"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                 >
                     <div className="text-center">
                         <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-200">UPI Payment Details</h3>
                         <p className="text-sm text-gray-500 dark:text-slate-500">Ensure these details are accurate to receive payments.</p>
                     </div>
                      <div className="relative group">
                          <Users className={iconClasses} />
                          <Input id="upiName" placeholder=" " value={formData.upiName} onChange={(e) => updateFormData({ upiName: e.target.value })} className={inputClasses} />
                          <Label htmlFor="upiName" className={labelClasses}>Name as per UPI</Label>
                      </div>
                      <div className="relative group">
                          <CreditCard className={iconClasses} />
                          <Input id="upiId" placeholder=" " value={formData.upiId} onChange={(e) => updateFormData({ upiId: e.target.value })} className={inputClasses} />
                          <Label htmlFor="upiId" className={labelClasses}>UPI ID (e.g., name@okicici)</Label>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowUPI(false)} className="w-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200">
                          Add Later
                      </Button>
                 </motion.div>
             )}
            </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex space-x-4 mt-8">
          <Button variant="outline" onClick={onBack} className="w-full text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} className="w-full font-semibold bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-teal-600 dark:hover:bg-teal-700 dark:text-white shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_theme(colors.teal.500/50%)] transition-all hover:scale-105">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
    </motion.div>
  )
}