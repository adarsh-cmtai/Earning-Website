import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUserDetailsForAdmin } from "@/lib/redux/features/admin/usersSlice";
import { UserProfileHeader } from "@/components/admin/users/details/UserProfileHeader";
import { UserProfileDownline } from "@/components/admin/users/details/UserProfileDownline";
import { UserProfileTransactions } from "@/components/admin/users/details/UserProfileTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSquare2 } from "lucide-react";

interface UserDetailPanelProps {
    userId: string | null;
}

const DetailSkeleton = () => (
    <div className="space-y-4">
        <div className="flex items-center gap-4 p-6"><Skeleton className="h-24 w-24 rounded-full" /><div className="space-y-2 flex-1"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-3/4" /></div></div>
        <div className="px-6"><Skeleton className="h-10 w-full" /></div>
        <div className="p-6"><Skeleton className="h-64 w-full" /></div>
    </div>
);

export function UserDetailPanel({ userId }: UserDetailPanelProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedUserProfile, status } = useSelector((state: RootState) => state.adminUsers);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetailsForAdmin(userId));
        }
    }, [userId, dispatch]);

    if (!userId) {
        return (
            <Card className="h-full rounded-lg">
                <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <UserSquare2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Select a User</h3>
                    <p className="text-sm text-muted-foreground">Click on a user from the list to view their details here.</p>
                </CardContent>
            </Card>
        );
    }

    if (status === 'loading' || !selectedUserProfile) {
        return (
            <Card className="rounded-lg">
                <DetailSkeleton />
            </Card>
        );
    }
    
    const { profile, transactions, downline } = selectedUserProfile;

    return (
        <Card className="h-full rounded-lg">
            <UserProfileHeader user={profile} />
            <Tabs defaultValue="downline" className="p-4 sm:p-6">
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="downline">Downline Structure</TabsTrigger><TabsTrigger value="income">Income History</TabsTrigger></TabsList>
                <TabsContent value="downline" className="mt-4"><UserProfileDownline downline={downline} /></TabsContent>
                <TabsContent value="income" className="mt-4"><UserProfileTransactions transactions={transactions} /></TabsContent>
            </Tabs>
        </Card>
    );
}