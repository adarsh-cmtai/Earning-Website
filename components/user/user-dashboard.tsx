import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, UserCheck, UserPlus, Users, AlertTriangle, DollarSign, Eye, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Admins",
    value: "12,847",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Active Admins",
    value: "9,234",
    change: "+8.2%",
    icon: UserPlus,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    title: "New Registrations",
    value: "1,247",
    change: "+23.1%",
    icon: UserPlus,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Platform Revenue",
    value: "₹8,45,230",
    change: "+15.3%",
    icon: DollarSign,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
]

const alerts = [
  {
    type: "warning",
    title: "Failed Payments",
    description: "23 payment failures in the last 24 hours",
    time: "2 hours ago",
  },
  {
    type: "error",
    title: "Suspicious Activity",
    description: "Multiple login attempts detected for Admin REF***456",
    time: "4 hours ago",
  },
  {
    type: "info",
    title: "System Maintenance",
    description: "Scheduled maintenance window starts in 2 hours",
    time: "6 hours ago",
  },
]

const recentActivities = [
  {
    Admin: "REF***789",
    action: "Completed daily assignments",
    time: "5 minutes ago",
    status: "success",
  },
  {
    Admin: "REF***012",
    action: "Downloaded AI video",
    time: "12 minutes ago",
    status: "success",
  },
  {
    Admin: "REF***345",
    action: "Payment processed",
    time: "25 minutes ago",
    status: "success",
  },
  {
    Admin: "REF***678",
    action: "Account suspended",
    time: "1 hour ago",
    status: "warning",
  },
]

export function AdminDashboard() {
  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-500 bg-red-500/10"
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
      default:
        return "border-blue-500 bg-blue-500/10"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-blue-500/20 text-blue-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{alert.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    View
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.Admin}</p>
                      <p className="text-xs text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{activity.time}</p>
                    <Badge className={getStatusColor(activity.status)} variant="secondary">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Assignment Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Today</span>
                <span className="text-white font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">This Week</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Platform Fee</span>
                <span className="text-green-400 font-medium">₹4,25,230</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Commission</span>
                <span className="text-blue-400 font-medium">₹2,85,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bonuses</span>
                <span className="text-purple-400 font-medium">₹1,35,000</span>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-white font-bold">₹8,45,230</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
              <Users className="inline mr-2 h-4 w-4" />
              Manage Admins
            </button>
            <button className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors">
              <DollarSign className="inline mr-2 h-4 w-4" />
              Process Payments
            </button>
            <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors">
              <TrendingUp className="inline mr-2 h-4 w-4" />
              View Reports
            </button>
            <button className="w-full p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors">
              <Eye className="inline mr-2 h-4 w-4" />
              System Logs
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
