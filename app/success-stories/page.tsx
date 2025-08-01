"use client"

import type React from "react"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, DollarSign, MapPin, Play, Send, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const videoTestimonials = [
  {
    id: 1,
    name: "Ravi Kumar",
    location: "Bihar",
    earnings: "₹52,000 in 3 Months",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Ravi+Video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder YouTube embed
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    earnings: "₹75,000 in 6 Months",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Priya+Video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    name: "Amit Patel",
    location: "Gujarat",
    earnings: "₹30,000 in 2 Months",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Amit+Video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    name: "Sneha Singh",
    location: "Uttar Pradesh",
    earnings: "₹90,000 in 8 Months",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Sneha+Video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
]

const writtenTestimonials = [
  {
    id: 1,
    name: "Deepak Verma",
    location: "Rajasthan",
    quote:
      "UEIEP has truly changed my financial situation. The daily assignments are easy, and the AI videos are a game-changer for my Social Media channel. Highly recommend!",
    rating: 5,
    photo: "/placeholder.svg?height=80&width=80&text=DV",
  },
  {
    id: 2,
    name: "Anjali Devi",
    location: "West Bengal",
    quote:
      "I was skeptical at first, but after 4 months, I've earned more than I ever thought possible. The support team is fantastic, and the referral system is incredibly rewarding.",
    rating: 5,
    photo: "/placeholder.svg?height=80&width=80&text=AD",
  },
  {
    id: 3,
    name: "Rahul Gupta",
    location: "Maharashtra",
    quote:
      "The AI video quality is top-notch, and it saves me so much time. My channel's growth has been exponential since joining UEIEP. This platform is a blessing!",
    rating: 4,
    photo: "/placeholder.svg?height=80&width=80&text=RG",
  },
  {
    id: 4,
    name: "Kavita Rao",
    location: "Karnataka",
    quote:
      "As a student, UEIEP provides a flexible way to earn extra income. The assignments are simple, and I'm learning a lot about digital marketing through the process.",
    rating: 4,
    photo: "/placeholder.svg?height=80&width=80&text=KR",
  },
  {
    id: 5,
    name: "Sanjay Singh",
    location: "Madhya Pradesh",
    quote:
      "The transparency in earnings and the instant UPI payouts are what I appreciate most. No hidden fees, just pure earning potential. Great platform!",
    rating: 5,
    photo: "/placeholder.svg?height=80&width=80&text=SS",
  },
]

export default function SuccessStoriesPage() {
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false)
  const [submitFormData, setSubmitFormData] = useState({
    name: "",
    incomeScreenshot: null as File | null,
    story: "",
    videoLink: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmitFormData((prev) => ({ ...prev, incomeScreenshot: e.target.files![0] }))
    }
  }

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Your story has been submitted for review! Thank you for sharing.")
    setIsSubmitting(false)
    setIsSubmitFormOpen(false)
    setSubmitFormData({ name: "", incomeScreenshot: null, story: "", videoLink: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6FA] to-white">
      <Header />

      <main>
        {/* Hero Banner */}
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00c2cb 0%, #007acc 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(/placeholder.svg?height=500&width=1000&text=Motivational+Background)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Real Stories.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Real Income.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Meet the people changing their lives with our platform
            </p>
          </div>
        </section>

        {/* Video Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Watch Their Journeys</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear directly from our successful members about their experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="card-shadow hover-lift border-0 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={testimonial.thumbnail || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                        <Button size="lg" className="bg-white/90 text-primary hover:bg-white rounded-full">
                          <Play className="h-8 w-8" />
                        </Button>
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <h3 className="text-xl font-semibold text-primary-dark mb-1">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" /> {testimonial.location}
                      </p>
                      <p className="text-lg font-bold text-green-600 flex items-center mb-4">
                        <DollarSign className="h-5 w-5 mr-1" /> {testimonial.earnings}
                      </p>
                      <Button className="w-full gradient-primary text-white" asChild>
                        <a href={testimonial.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-4 w-4" />
                          Watch Story
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Written Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">What Our Admins Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Read inspiring feedback from our growing community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {writtenTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="card-shadow border-0 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {testimonial.photo && (
                        <img
                          src={testimonial.photo || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-primary-dark">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">{testimonial.location}</p>
                      </div>
                      {testimonial.rating && (
                        <div className="ml-auto flex items-center text-yellow-500">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed italic mb-4">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Submit Your Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <Card className="card-shadow max-w-3xl mx-auto bg-gradient-primary text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Share Your Journey!</h2>
                <p className="text-white/90 mb-6">
                  Inspire others by sharing your success story and how UEIEP has impacted your life.
                </p>
                <Button
                  className="bg-white text-primary hover:bg-gray-100 py-3 px-6 text-lg font-semibold"
                  onClick={() => setIsSubmitFormOpen(true)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Share My Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Submit Story Dialog */}
      <Dialog open={isSubmitFormOpen} onOpenChange={setIsSubmitFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary-dark">Submit Your Success Story</DialogTitle>
            <DialogDescription>Tell us about your experience and earnings with UEIEP.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitStory} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="storyName">Your Name</Label>
              <Input
                id="storyName"
                placeholder="Enter your full name"
                value={submitFormData.name}
                onChange={(e) => setSubmitFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeScreenshot">Income Screenshot (Optional)</Label>
              <Input id="incomeScreenshot" type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-sm text-gray-500">Upload a screenshot of your UEIEP earnings for verification.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storyText">Your Story *</Label>
              <Textarea
                id="storyText"
                placeholder="Share your journey, how you started, and your achievements..."
                value={submitFormData.story}
                onChange={(e) => setSubmitFormData((prev) => ({ ...prev, story: e.target.value }))}
                className="min-h-[120px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoLink">Social Media Video Link (Optional)</Label>
              <Input
                id="videoLink"
                placeholder="Link to your video testimonial (if any)"
                value={submitFormData.videoLink}
                onChange={(e) => setSubmitFormData((prev) => ({ ...prev, videoLink: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Story
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
