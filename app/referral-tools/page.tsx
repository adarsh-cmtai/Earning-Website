"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Share2, MessageCircle, Send, Mail, Download, Play, Youtube, Instagram, Facebook } from "lucide-react"
import { toast } from "sonner"

const referralData = {
  referralId: "REF123456",
  referralLink: "https://ueiep.com/register?ref=REF123456",
  qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR+Code", // Placeholder for QR code
}

const prewrittenMessages = {
  whatsapp: `🚀 Join UEIEP and transform your income! Earn daily by watching videos, creating AI content, and building your referral network. It's free to join! Click here: ${referralData.referralLink} #UEIEP #EarnOnline #PassiveIncome`,
  telegram: `🔥 Ready to boost your earnings? UEIEP offers daily assignments, AI video creation, and a powerful 5-level referral system. Start your journey to financial freedom today! ${referralData.referralLink} #DigitalIncome #UEIEPCommunity`,
  email: `Subject: Your Invitation to Universal Employment & Income Empowerment Platform!

Dear [Friend's Name],

I wanted to share an incredible opportunity with you: the Universal Employment & Income Empowerment Platform (UEIEP). It's a revolutionary platform where you can earn income through AI-generated content creation, daily assignments, and a multi-level referral program.

It's completely free to join, and I've personally seen great results. You can earn by simply watching videos, creating AI-powered Social Media content, and building your network.

Here's my personal referral link to get started:
${referralData.referralLink}

I highly recommend checking it out if you're looking for a flexible way to earn online. Let me know if you have any questions!

Best regards,
[Your Name]`,
}

const shareableBanners = [
  {
    id: 1,
    title: "Join & Earn Banner",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Banner+1",
    downloadUrl: "/placeholder.svg?height=300&width=500&text=Banner+1",
  },
  {
    id: 2,
    title: "Passive Income Banner",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Banner+2",
    downloadUrl: "/placeholder.svg?height=300&width=500&text=Banner+2",
  },
  {
    id: 3,
    title: "AI Content Banner",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Banner+3",
    downloadUrl: "/placeholder.svg?height=300&width=500&text=Banner+3",
  },
  {
    id: 4,
    title: "Referral Bonus Banner",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Banner+4",
    downloadUrl: "/placeholder.svg?height=300&width=500&text=Banner+4",
  },
]

const videoCreatives = [
  {
    id: 1,
    title: "Quick Start Guide (Short)",
    thumbnail: "/placeholder.svg?height=150&width=250&text=Video+1",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder YouTube embed
    caption:
      "🚀 Start earning today with UEIEP! Daily assignments, AI videos, and referral income. Join free! #UEIEP #EarnOnline",
    platforms: ["Social Media Shorts", "Instagram Reels"],
  },
  {
    id: 2,
    title: "Why UEIEP? (Explainer)",
    thumbnail: "/placeholder.svg?height=150&width=250&text=Video+2",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caption:
      "💰 Discover how UEIEP empowers your income. Multiple streams, secure payments, and a thriving community. #DigitalIncome #FinancialFreedom",
    platforms: ["Social Media", "Facebook"],
  },
  {
    id: 3,
    title: "Referral Program Deep Dive",
    thumbnail: "/placeholder.svg?height=150&width=250&text=Video+3",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caption:
      "🤝 Build your network and earn passive income with UEIEP's 5-level referral system. Learn how! #ReferralMarketing #PassiveIncome",
    platforms: ["Social Media", "Telegram"],
  },
]

export default function ReferralToolsPage() {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${filename} downloaded!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6FA] to-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00c2cb 0%, #007acc 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url(/placeholder.svg?height=500&width=1000&text=Referral+Icons)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Grow Your Network,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Earn More
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">Use these tools to refer & grow your downline</p>
          </div>
        </section>

        {/* Unique Referral Link */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-dark flex items-center space-x-2">
                  <Share2 className="h-6 w-6" />
                  <span>Your Unique Referral Link</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-2">
                    <Label htmlFor="referralId">Your Referral ID</Label>
                    <div className="flex space-x-2">
                      <Input id="referralId" value={referralData.referralId} readOnly className="bg-gray-50" />
                      <Button variant="outline" onClick={() => copyToClipboard(referralData.referralId, "Referral ID")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralLink">Your Referral Link</Label>
                    <div className="flex space-x-2">
                      <Input id="referralLink" value={referralData.referralLink} readOnly className="bg-gray-50" />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(referralData.referralLink, "Referral Link")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-primary-dark mb-3">QR Code for Offline Sharing</h3>
                  <img
                    src={referralData.qrCodeUrl || "/placeholder.svg"}
                    alt="Referral QR Code"
                    className="w-48 h-48 mx-auto border rounded-lg p-2"
                  />
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => handleDownload(referralData.qrCodeUrl, "ueiep-referral-qr.png")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pre-written Messages */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-dark flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Pre-written Messages</span>
                </CardTitle>
                <p className="text-gray-600">Quickly share these messages on your favorite platforms.</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="whatsapp" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="whatsapp">
                      <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                    </TabsTrigger>
                    <TabsTrigger value="telegram">
                      <Send className="mr-2 h-4 w-4" /> Telegram
                    </TabsTrigger>
                    <TabsTrigger value="email">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="whatsapp" className="mt-6">
                    <div className="bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {prewrittenMessages.whatsapp}
                    </div>
                    <Button
                      className="w-full mt-4 gradient-primary text-white"
                      onClick={() => copyToClipboard(prewrittenMessages.whatsapp, "WhatsApp Message")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Message
                    </Button>
                  </TabsContent>
                  <TabsContent value="telegram" className="mt-6">
                    <div className="bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {prewrittenMessages.telegram}
                    </div>
                    <Button
                      className="w-full mt-4 gradient-primary text-white"
                      onClick={() => copyToClipboard(prewrittenMessages.telegram, "Telegram Message")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Message
                    </Button>
                  </TabsContent>
                  <TabsContent value="email" className="mt-6">
                    <div className="bg-white border rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                      {prewrittenMessages.email}
                    </div>
                    <Button
                      className="w-full mt-4 gradient-primary text-white"
                      onClick={() => copyToClipboard(prewrittenMessages.email, "Email Message")}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Message
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Shareable Banners */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-dark flex items-center space-x-2">
                  <Download className="h-6 w-6" />
                  <span>Shareable Banners</span>
                </CardTitle>
                <p className="text-gray-600">Download high-quality images to share on social media.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shareableBanners.map((banner) => (
                    <Card key={banner.id} className="hover-lift border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-4">
                        <img
                          src={banner.imageUrl || "/placeholder.svg"}
                          alt={banner.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-primary-dark mb-2 line-clamp-1">{banner.title}</h3>
                        <Button
                          className="w-full gradient-primary text-white"
                          onClick={() =>
                            handleDownload(banner.downloadUrl, `${banner.title.toLowerCase().replace(/\s/g, "-")}.png`)
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Image
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Video Creatives */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-dark flex items-center space-x-2">
                  <Play className="h-6 w-6" />
                  <span>Video Creatives</span>
                </CardTitle>
                <p className="text-gray-600">Short, engaging videos perfect for social media platforms.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoCreatives.map((video) => (
                    <Card key={video.id} className="hover-lift border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                            <Button size="icon" className="rounded-full bg-white/80 hover:bg-white text-primary">
                              <Play className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-primary-dark mb-2 line-clamp-1">{video.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {video.platforms.map((platform, index) => (
                            <div
                              key={index}
                              className="text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-1 flex items-center"
                            >
                              {platform === "Social Media Shorts" && <Youtube className="mr-1 h-3 w-3" />}
                              {platform === "Instagram Reels" && <Instagram className="mr-1 h-3 w-3" />}
                              {platform === "Social Media" && <Youtube className="mr-1 h-3 w-3" />}
                              {platform === "Facebook" && <Facebook className="mr-1 h-3 w-3" />}
                              {platform === "Telegram" && <Send className="mr-1 h-3 w-3" />}
                              {platform}
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full gradient-primary text-white"
                            onClick={() =>
                              handleDownload(video.videoUrl, `${video.title.toLowerCase().replace(/\s/g, "-")}.mp4`)
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Video
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => copyToClipboard(video.caption, "Video Caption")}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Caption
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
