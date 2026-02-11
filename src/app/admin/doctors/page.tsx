"use client"

import { useState, useEffect } from "react"
import { fetchDoctors } from "@/services/doctor.sevice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DoctorDetailsDialog } from "@/components/admin/doctor-details-dialog"

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    speciality: "Obstetrics & Gynecology",
    license: "MED-001234",
    yearsExp: 8,
    status: "approved",
    joinDate: "2022-01-15",
    phone: "+1-555-0101",
  },
  {
    id: 2,
    name: "Dr. Emily Davis",
    email: "emily@example.com",
    speciality: "Reproductive Health",
    license: "MED-001235",
    yearsExp: 5,
    status: "approved",
    joinDate: "2022-06-20",
    phone: "+1-555-0102",
  },
  {
    id: 3,
    name: "Dr. Jessica Brown",
    email: "jessica@example.com",
    speciality: "Gynecology",
    license: "MED-001236",
    yearsExp: 12,
    status: "suspended",
    joinDate: "2021-03-10",
    phone: "+1-555-0103",
  },
]

interface DoctorUI {
  id: number
  name: string
  email: string
  speciality: string
  license: string
  yearsExp: number
  status: string
  joinDate: string
  phone: string
}

interface BackendDoctor {
  id: number;
  status: string;
  experience_years: number;
  phone: string;
  joined_at: string;
  MedicalLicenseNumber: string;
  user: {
    name: string;
    email: string;
  };

  speciality: {
    name: string;
  };
}

function mapBackendDoctor(doc: BackendDoctor): DoctorUI {
  return {
    id: doc.id,
    name: doc.user.name,
    email: doc.user.email,
    speciality: doc.speciality.name,
    license: doc.MedicalLicenseNumber,
    yearsExp: doc.experience_years,
    status: doc.status,
    joinDate: doc.joined_at,
    phone: doc.phone,
  }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorUI | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data: BackendDoctor[] = await fetchDoctors();
        setDoctors(data.map(mapBackendDoctor));
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);


  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSuspend = (id: number) => {
    setDoctors(doctors.map((doc) => (doc.id === id ? { ...doc, status: "suspended" } : doc)))
  }

  const handleReactivate = (id: number) => {
    setDoctors(doctors.map((doc) => (doc.id === id ? { ...doc, status: "approved" } : doc)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Doctors Management</h1>
        <p className="text-muted-foreground mt-2">Manage all registered doctors and their status</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Speciality</th>
                  <th className="text-left py-3 px-4 font-semibold">Experience</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor)
                          setDialogOpen(true)
                        }}
                        className="font-medium text-[#c94d8a] hover:underline"
                      >
                        {doctor.name}
                      </button>
                    </td>
                    <td className="py-3 px-4">{doctor.speciality}</td>
                    <td className="py-3 px-4">{doctor.yearsExp} years</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doctor.status)}`}>
                        {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoctor(doctor)
                              setDialogOpen(true)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          {doctor.status === "approved" && (
                            <DropdownMenuItem onClick={() => handleSuspend(doctor.id)} className="text-red-600">
                              Suspend Doctor
                            </DropdownMenuItem>
                          )}
                          {doctor.status === "suspended" && (
                            <DropdownMenuItem onClick={() => handleReactivate(doctor.id)} className="text-green-600">
                              Reactivate Doctor
                            </DropdownMenuItem>
                          )}
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

      {selectedDoctor && <DoctorDetailsDialog doctor={selectedDoctor} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  )
}
