"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockReports = [
  {
    id: 1,
    type: "Inappropriate Conduct",
    reporter: "Patient - Emma Wilson",
    subject: "Dr. Sarah Johnson",
    date: "2024-02-15",
    status: "open",
    priority: "high",
  },
  {
    id: 2,
    type: "Service Complaint",
    reporter: "Patient - Sophia Garcia",
    subject: "Appointment Not Attended",
    date: "2024-02-12",
    status: "investigating",
    priority: "medium",
  },
  {
    id: 3,
    type: "Technical Issue",
    reporter: "Patient - Olivia Martinez",
    subject: "Payment Failed",
    date: "2024-02-10",
    status: "resolved",
    priority: "low",
  },
  {
    id: 4,
    type: "Medical Concern",
    reporter: "Patient - Ava Johnson",
    subject: "Incorrect Diagnosis",
    date: "2024-02-08",
    status: "open",
    priority: "high",
  },
]

export function ReportsContent() {
  const [reports, setReports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "investigating" | "resolved">("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "investigating":
        return "bg-amber-100 text-amber-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reports & Complaints</h1>
        <p className="text-muted-foreground mt-2">Review and manage patient reports and complaints</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "open" | "investigating" | "resolved")}
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Reports</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${getPriorityColor(report.priority)}`} />
                    <h3 className="font-semibold">{report.type}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium">Subject: {report.subject}</p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Reported by: {report.reporter}</div>
                    <div>Date: {new Date(report.date).toLocaleDateString()}</div>
                    <div>Priority: {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      ...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Investigating</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">No reports found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
