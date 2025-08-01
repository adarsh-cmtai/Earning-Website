import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Youtube, XCircle } from "lucide-react"
import Link from "next/link"

interface ProfileStatusCardProps {
  status: 'Verified' | 'Pending' | 'Declined' | 'Not Linked';
  topic: string;
  channelName: string;
}

export function ProfileStatusCard({ status, topic, channelName }: ProfileStatusCardProps) {
    const getStatusInfo = () => {
        switch(status) {
            case 'Verified':
                return { 
                    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
                    title: "Channel Approved!",
                    description: "Your Social Media channel is verified and ready to go.",
                    badgeVariant: "default" as const,
                };
            case 'Pending':
                return { 
                    icon: <Clock className="h-6 w-6 text-yellow-500" />,
                    title: "Pending Approval",
                    description: "Our team is reviewing your channel. This usually takes 24-48 hours.",
                    badgeVariant: "secondary" as const,
                };
            case 'Declined':
                 return { 
                    icon: <XCircle className="h-6 w-6 text-red-500" />,
                    title: "Action Required",
                    description: "Your channel was declined. Please contact support for details.",
                    badgeVariant: "destructive" as const,
                };
            default:
                 return { 
                    icon: <Youtube className="h-6 w-6 text-red-500" />,
                    title: "Setup Incomplete",
                    description: "You haven't finished your profile and channel setup yet.",
                    badgeVariant: "outline" as const,
                };
        }
    }

    const statusInfo = getStatusInfo();

    return (
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Onboarding Status</span>
                    <Badge variant={statusInfo.badgeVariant}>{status}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    {statusInfo.icon}
                </div>
                <h3 className="text-lg font-semibold">{statusInfo.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{statusInfo.description}</p>
                <div className="text-left text-sm space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Selected Topic:</span>
                        <span className="font-medium">{topic || 'Not Selected'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Channel Name:</span>
                        <span className="font-medium">{channelName || 'Not Selected'}</span>
                    </div>
                </div>
                {status !== 'Verified' && (
                    <Button asChild className="w-full mt-4">
                        <Link href="/profile">
                            {status === 'Declined' ? 'Contact Support' : 'Continue Setup'}
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}