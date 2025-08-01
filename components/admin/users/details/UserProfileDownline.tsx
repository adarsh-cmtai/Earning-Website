import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

export function UserProfileDownline({ downline }: { downline: any }) {
  return (
    <Card className="rounded-lg">
      <CardHeader><CardTitle>Downline Structure</CardTitle><CardDescription>Total Referrals: {downline.totalReferrals}</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-2">
            {downline.levels.map((level: any) => (
                <Collapsible key={level.level}>
                    <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-muted rounded-md">
                        <span className="font-semibold">Level {level.level} ({level.count} members)</span>
                        <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-2 pl-6 border-l ml-3 mt-1">
                        {level.members.map((member: any) => (
                            <div key={member._id} className="text-xs text-muted-foreground">{member.userIdMasked} - Earned: ₹{member.incomeContribution}</div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}