"use client"

import { Users, FileCheck, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpecialtyChart } from "@/components/admin/specialty-chart"
import { AppointmentStatusChart } from "@/components/admin/appointment-status-chart"
import { TopDoctorsTable } from "@/components/admin/top-doctors-table"

export default function AdminOverview() {
  const stats = [
    {
      label: "Total Patients",
      value: "1,247",
      icon: Users,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Doctors",
      value: "89",
      icon: Users,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Pending Applications",
      value: "23",
      icon: FileCheck,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Appointments This Month",
      value: "342",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ]

  const recentActivities = [
    { type: "New Doctor Application", date: "2 hours ago", status: "Pending" },
    { type: "Patient Registration", date: "5 hours ago", status: "Completed" },
    { type: "Appointment Booked", date: "1 day ago", status: "Completed" },
    { type: "Doctor Suspended", date: "2 days ago", status: "Alert" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      activity.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : activity.status === "Alert"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/doctor-applications">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Review Applications
              </Button>
            </Link>
            <Link href="/admin/appointments">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Manage Appointments
              </Button>
            </Link>
            <Link href="/admin/patients">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                View Patients
              </Button>
            </Link>
            <Link href="/admin/doctors">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                Manage Doctors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpecialtyChart />
        <AppointmentStatusChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopDoctorsTable />
      </div>
    </div>
  )
}
