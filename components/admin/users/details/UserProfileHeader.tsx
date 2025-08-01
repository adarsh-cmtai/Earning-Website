import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Smartphone, CheckCircle, Clock } from "lucide-react";
import { type User as UserType } from "@/lib/types";

export function UserProfileHeader({ user }: { user: UserType }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-6">
        <Avatar className="h-24 w-24 border">
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} />
            <AvatarFallback>{user.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <Badge variant={user.status === "Approved" ? "default" : "destructive"}>{user.status}</Badge>
            </div>
            <div className="text-muted-foreground space-y-1 text-sm">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4"/> {user.email}</p>
                <p className="flex items-center gap-2"><Smartphone className="h-4 w-4"/> {user.mobile}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm w-full sm:w-auto">
            <div className="p-3 bg-muted rounded-md text-center">
                <p className="font-bold text-lg">₹{(user.totalEarnings ?? 0).toLocaleString()}</p>
                <p className="text-muted-foreground text-xs">Total Earnings</p>
            </div>
            <div className="p-3 bg-muted rounded-md text-center">
                <p className="font-bold text-lg">₹{(user.pendingPayout ?? 0).toLocaleString()}</p>
                <p className="text-muted-foreground text-xs">Pending Payout</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}