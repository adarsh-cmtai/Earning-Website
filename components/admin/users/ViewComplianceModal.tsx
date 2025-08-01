"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/lib/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUserCompliance } from "@/lib/redux/features/admin/usersSlice";
import { FileCheck, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    colorClass?: string;
}

const ProgressRing = ({ progress, size = 120, strokeWidth = 10, colorClass = "text-primary" }: ProgressRingProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute" width={size} height={size}>
                <circle
                    className="text-muted/20"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn("transition-all duration-500 ease-in-out", colorClass)}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <span className="text-2xl font-bold">{progress}%</span>
        </div>
    );
};

const ComplianceSkeleton = () => (
    <div className="py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center p-4"><Skeleton className="h-24 w-24 rounded-full" /><Skeleton className="h-4 w-20 mt-2" /></Card>
            <Card className="flex flex-col items-center justify-center p-4"><Skeleton className="h-24 w-24 rounded-full" /><Skeleton className="h-4 w-20 mt-2" /></Card>
        </div>
        <Card className="p-4"><div className="flex items-center gap-4"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div></div></Card>
    </div>
);


interface ViewComplianceModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewComplianceModal({ user, isOpen, onClose }: ViewComplianceModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { complianceData, status } = useSelector((state: RootState) => state.adminUsers);

  useEffect(() => {
    if (isOpen && user?._id) {
      dispatch(fetchUserCompliance(user._id));
    }
  }, [isOpen, user, dispatch]);
  
  const getComplianceStyling = (status: string | undefined) => {
    switch (status) {
      case 'Good Standing': return { Icon: CheckCircle, text: "Good Standing", description: "This user is meeting all compliance standards.", color: "green" };
      case 'At Risk': return { Icon: AlertTriangle, text: "At Risk", description: "This user is close to falling out of compliance.", color: "yellow" };
      case 'Non-Compliant': return { Icon: XCircle, text: "Non-Compliant", description: "This user is not meeting compliance standards.", color: "red" };
      default: return { Icon: AlertTriangle, text: "Unknown", description: "Compliance status could not be determined.", color: "gray" };
    }
  };

  const renderContent = () => {
    if (status === 'loading' || !complianceData) {
        return <ComplianceSkeleton />;
    }

    const { Icon, text, description, color } = getComplianceStyling(complianceData.overallStatus);
    
    return (
        <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <ProgressRing progress={complianceData.dailyCompletion} colorClass="text-blue-500" />
                    <p className="mt-2 text-sm font-medium">Daily Completion</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <ProgressRing progress={complianceData.monthlyCompletion} colorClass="text-purple-500" />
                    <p className="mt-2 text-sm font-medium">Monthly Completion</p>
                </Card>
            </div>
            <Card className={cn(
                "p-4",
                color === "green" && "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
                color === "yellow" && "bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800",
                color === "red" && "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800"
            )}>
                <div className="flex items-center gap-4">
                    <Icon className={cn(
                        "h-8 w-8 flex-shrink-0",
                        color === "green" && "text-green-500",
                        color === "yellow" && "text-yellow-500",
                        color === "red" && "text-red-500"
                    )} />
                    <div>
                        <h4 className="font-semibold">{text}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-7 w-7 text-primary" />
            </div>
            <div>
                <DialogTitle className="text-xl">Compliance Report</DialogTitle>
                <DialogDescription>Viewing compliance metrics for the user.</DialogDescription>
            </div>
        </DialogHeader>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <Avatar className="h-12 w-12">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random`} />
                <AvatarFallback>{user.fullName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
        </div>
        {renderContent()}
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}