// OTP Service - Integrates with SMS and Email providers
interface OTPResponse {
  success: boolean
  message: string
  otpId?: string
  error?: string
}

interface VerifyOTPResponse {
  success: boolean
  message: string
  error?: string
}

// Simulated Twilio SMS Service
class SMSService {
  private apiKey = process.env.NEXT_PUBLIC_TWILIO_API_KEY || "demo_key"
  private accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || "demo_sid"
  private fromNumber = process.env.NEXT_PUBLIC_TWILIO_FROM_NUMBER || "+1234567890"

  async sendOTP(phoneNumber: string, otp: string): Promise<OTPResponse> {
    try {
      // In production, replace with actual Twilio API call
      const response = await fetch("/api/sms/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: `Your UEIEP verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`,
          from: this.fromNumber,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: "OTP sent successfully via SMS",
          otpId: data.messageId,
        }
      } else {
        return {
          success: false,
          message: "Failed to send SMS",
          error: data.error,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "SMS service error",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Simulated SendGrid Email Service
class EmailService {
  private apiKey = process.env.NEXT_PUBLIC_SENDGRID_API_KEY || "demo_key"
  private fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || "noreply@ueiep.com"

  async sendOTP(email: string, otp: string, AdminName: string): Promise<OTPResponse> {
    try {
      // In production, replace with actual SendGrid API call
      const response = await fetch("/api/email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          from: this.fromEmail,
          subject: "UEIEP - Email Verification Code",
          html: this.generateEmailTemplate(AdminName, otp),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: "OTP sent successfully via email",
          otpId: data.messageId,
        }
      } else {
        return {
          success: false,
          message: "Failed to send email",
          error: data.error,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: "Email service error",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private generateEmailTemplate(AdminName: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>UEIEP - Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00c2cb 0%, #007acc 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background: white; border: 2px solid #00c2cb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #00c2cb; letter-spacing: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>UEIEP Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${AdminName}!</h2>
              <p>Thank you for registering with the Universal Employment & Income Empowerment Platform.</p>
              <p>To complete your registration, please use the verification code below:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666;">This code expires in 10 minutes</p>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>Do not share this code with anyone</li>
                <li>UEIEP will never ask for this code via phone or email</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
              
              <p>If you have any questions, contact our support team at support@ueiep.com</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Universal Employment & Income Empowerment Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

// Main OTP Service
export class OTPService {
  private smsService = new SMSService()
  private emailService = new EmailService()
  private otpStore = new Map<string, { otp: string; expires: number; attempts: number }>()

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async sendOTP(
    email: string,
    mobile: string,
    AdminName: string,
  ): Promise<{
    sms: OTPResponse
    email: OTPResponse
    otp: string
  }> {
    const otp = this.generateOTP()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP for verification
    const otpKey = `${email}_${mobile}`
    this.otpStore.set(otpKey, { otp, expires, attempts: 0 })

    // Send via both SMS and Email
    const [smsResult, emailResult] = await Promise.all([
      this.smsService.sendOTP(mobile, otp),
      this.emailService.sendOTP(email, otp, AdminName),
    ])

    return {
      sms: smsResult,
      email: emailResult,
      otp, // Remove this in production - only for demo
    }
  }

  async verifyOTP(email: string, mobile: string, inputOtp: string): Promise<VerifyOTPResponse> {
    const otpKey = `${email}_${mobile}`
    const storedData = this.otpStore.get(otpKey)

    if (!storedData) {
      return {
        success: false,
        message: "OTP not found. Please request a new one.",
        error: "OTP_NOT_FOUND",
      }
    }

    if (Date.now() > storedData.expires) {
      this.otpStore.delete(otpKey)
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
        error: "OTP_EXPIRED",
      }
    }

    if (storedData.attempts >= 3) {
      this.otpStore.delete(otpKey)
      return {
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
        error: "TOO_MANY_ATTEMPTS",
      }
    }

    if (storedData.otp !== inputOtp) {
      storedData.attempts++
      return {
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`,
        error: "INVALID_OTP",
      }
    }

    // Success - remove OTP from store
    this.otpStore.delete(otpKey)
    return {
      success: true,
      message: "OTP verified successfully!",
    }
  }

  async resendOTP(
    email: string,
    mobile: string,
    AdminName: string,
  ): Promise<{
    sms: OTPResponse
    email: OTPResponse
  }> {
    // Clear existing OTP
    const otpKey = `${email}_${mobile}`
    this.otpStore.delete(otpKey)

    // Send new OTP
    const result = await this.sendOTP(email, mobile, AdminName)
    return {
      sms: result.sms,
      email: result.email,
    }
  }
}

// Singleton instance
export const otpService = new OTPService()
