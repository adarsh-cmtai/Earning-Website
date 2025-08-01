import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Users,
    AlertCircle,
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    LifeBuoy,
    Mail,
    MessageCircle,
    Phone,
    Search,
    Send,
    Video,
} from "lucide-react"

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7 Available",
    responseTime: "< 2 minutes",
    action: "Start Chat",
    color: "bg-green-500",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us detailed questions or issues",
    availability: "24/7 Available",
    responseTime: "< 4 hours",
    action: "Send Email",
    color: "bg-blue-500",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our experts",
    availability: "9 AM - 6 PM IST",
    responseTime: "Immediate",
    action: "Call Now",
    color: "bg-purple-500",
  },
  {
    icon: Video,
    title: "Video Call",
    description: "Screen sharing for technical issues",
    availability: "10 AM - 5 PM IST",
    responseTime: "Schedule required",
    action: "Book Call",
    color: "bg-orange-500",
  },
]

const helpResources = [
  {
    icon: BookOpen,
    title: "Admin Guide",
    description: "Complete guide to using UEIEP platform",
    items: ["Getting Started", "Daily Assignments", "AI Videos", "Payments"],
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video instructions",
    items: ["Platform Overview", "Social Media Setup", "Referral System", "Troubleshooting"],
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Technical documentation and APIs",
    items: ["API Reference", "Integration Guide", "Best Practices", "Updates"],
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Connect with other UEIEP Admins",
    items: ["Success Stories", "Tips & Tricks", "Q&A", "Announcements"],
  },
]

const commonIssues = [
  {
    title: "Login Problems",
    description: "Can't access your account?",
    icon: AlertCircle,
    solutions: ["Reset password", "Clear browser cache", "Check email verification"],
  },
  {
    title: "Payment Issues",
    description: "Problems with withdrawals?",
    icon: AlertCircle,
    solutions: ["Verify UPI details", "Check minimum balance", "Contact payment support"],
  },
  {
    title: "Assignment Not Loading",
    description: "Daily assignments not appearing?",
    icon: AlertCircle,
    solutions: ["Refresh the page", "Check internet connection", "Clear browser data"],
  },
  {
    title: "Social Media Channel Issues",
    description: "Problems with AI video uploads?",
    icon: AlertCircle,
    solutions: ["Check Social Media policies", "Verify channel monetization", "Review content guidelines"],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6FA] to-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LifeBuoy className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Help{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Center</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                We're here to help you succeed on the UEIEP platform
              </p>

              {/* Quick Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search for help articles, tutorials, or FAQs..."
                    className="pl-12 pr-4 py-4 text-lg bg-white/90 border-0 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Get Support</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the best way to get help. Our team is available 24/7 to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {supportOptions.map((option, index) => (
                <Card key={index} className="card-shadow hover-lift border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <option.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-dark mb-2">{option.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{option.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">{option.availability}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-600">{option.responseTime}</span>
                      </div>
                    </div>

                    <Button className="w-full gradient-primary text-white">{option.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="card-shadow max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" />
                  </div>

                  <Button className="w-full gradient-primary text-white py-3 text-lg font-semibold hover-lift">
                    <Send className="mr-2 h-5 w-5" />
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Help Resources */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Self-Help Resources</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse our extensive library of guides, tutorials, and FAQs to find solutions quickly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpResources.map((resource, index) => (
                <Card key={index} className="card-shadow hover-lift border-0 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <resource.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-dark mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    <ul className="text-sm text-gray-700 space-y-1 mb-4">
                      {resource.items.map((item, i) => (
                        <li key={i} className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="bg-transparent">
                      View Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Common Issues & Solutions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Quick fixes for the most frequently encountered problems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {commonIssues.map((issue, index) => (
                <Card key={index} className="card-shadow border-l-4 border-l-red-500 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <issue.icon className="h-8 w-8 text-red-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">{issue.title}</h3>
                        <p className="text-red-700 text-sm mb-3">{issue.description}</p>
                        <ul className="text-sm text-red-700 space-y-1">
                          {issue.solutions.map((solution, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-red-600" />
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
