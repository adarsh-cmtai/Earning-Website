import { UserLayout } from "@/components/user/user-layout"
import { AdminDashboard } from "@/components/user/user-dashboard"

export default function AdminPage() {
  return (
    <UserLayout>
      <AdminDashboard />
    </UserLayout>
  )
}
