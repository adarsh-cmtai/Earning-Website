"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchUserDetailsForAdmin, clearSelectedUser } from "@/lib/redux/features/admin/usersSlice";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserProfileHeader } from "@/components/admin/users/details/UserProfileHeader";
import { UserProfileDownline } from "@/components/admin/users/details/UserProfileDownline";
// import { UserProfileTransactions } from "@/components/admin/users/details/UserProfileTransactions";

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedUserProfile, status } = useSelector((state: RootState) => state.adminUsers);
    
    const userId = params.userId as string;

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetailsForAdmin(userId));
        }
        return () => {
            dispatch(clearSelectedUser());
        }
    }, [userId, dispatch]);
    
    if (status === 'loading' || !selectedUserProfile) {
        return <FullScreenLoader />;
    }

    const { profile, transactions, downline } = selectedUserProfile;

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/admin/users')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Users
            </Button>
            
            <UserProfileHeader user={profile} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserProfileDownline downline={downline} />
                {/* <UserProfileTransactions transactions={transactions} /> */}
            </div>
        </div>
    );
}