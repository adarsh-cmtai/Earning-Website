// Environment configuration for OTP services
export const config = {
  // Twilio Configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  },

  // SendGrid Configuration
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL || "noreply@ueiep.com",
  },

  // OTP Configuration
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
  },
}
