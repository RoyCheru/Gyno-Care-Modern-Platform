"use client"

import { useState, useEffect } from "react"
import { fetchAppointments } from "@/services/appointment.services"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const mockAppointments = [
  {
    id: 1,
    patientName: "Emma Wilson",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-02-15",
    time: "10:00 AM",
    status: "confirmed",
    type: "Video Consultation",
  },
  {
    id: 2,
    patientName: "Sophia Garcia",
    doctorName: "Dr. Emily Davis",
    date: "2024-02-20",
    time: "2:30 PM",
    status: "pending",
    type: "In-Person",
  },
  {
    id: 3,
    patientName: "Olivia Martinez",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-02-18",
    time: "11:00 AM",
    status: "completed",
    type: "Video Consultation",
  },
  {
    id: 4,
    patientName: "Ava Johnson",
    doctorName: "Dr. Jessica Brown",
    date: "2024-02-22",
    time: "3:00 PM",
    status: "cancelled",
    type: "Follow-up",
  },
]

interface Appointment {
  id: number
  patientName: string
  doctorName: string
  date: string
  time: string
  status: string
  type: string
}

const formatAppointment = (apt: any): Appointment => {
  const dateObj = new Date(apt.appointment_time);

  return {
    id: apt.id,

    patientName: apt.patient?.name ?? "Unknown Patient",

    doctorName: apt.doctor?.user?.name ?? "Unknown Doctor",

    date: dateObj.toISOString().split("T")[0],

    time: dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    status: apt.status,

    type:
      apt.consultation_type === "video"
        ? "Video Consultation"
        : "Physical Consultation",
  };
};


export function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "pending" | "completed" | "cancelled">("all")
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof mockAppointments)[0] | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || apt.status === filterStatus
    return matchesSearch && matchesFilter
  })

  //fetch appointments from backend
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAppointments();

        const normalized = data.map(formatAppointment);

        setAppointments(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);


  const handleDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment.id))
      setShowDeleteDialog(false)
      setSelectedAppointment(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-2">Manage all appointments and consultations</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "confirmed" | "pending" | "completed" | "cancelled")
            }
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Appointments</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold">Doctor</th>
                  <th className="text-left py-3 px-4 font-semibold">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{apt.patientName}</td>
                    <td className="py-3 px-4">{apt.doctorName}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{new Date(apt.date).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">{apt.time}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{apt.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ...
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {apt.status === "confirmed" || apt.status === "pending" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAppointment(apt)
                                setShowDeleteDialog(true)
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel Appointment
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredAppointments.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No appointments found</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Cancel Appointment
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Cancel Appointment
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
