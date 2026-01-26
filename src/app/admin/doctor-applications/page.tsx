"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle } from "lucide-react"
import { ApplicationDetailsDialog } from "@/components/admin/application-details-dialog"
import { fetchDoctorApplications } from "@/services/doctor.sevice"
import { approveDoctorApplication, rejectDoctorApplication } from "@/services/doctor.sevice"

const mockApplications = [
  {
    id: 1,
    full_name: "Dr. Amanda White",
    email: "amanda.white@example.com",
    phone: "+1-555-0201",
    speciality: {
      id: 1,
      name: "Pediatric Gynecology"
    },
    medicalLicenceNumber: "MED-001240",
    years_of_experience: 6,
    bio: "Experienced in pediatric gynecological care with focus on adolescent health.",
    created_at: "2024-01-10",
    status: "pending",
  },
  {
    id: 2,
    full_name: "Dr. Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+1-555-0202",
    speciality: {
      id: 2,
      name: "Obstetrics & Gynecology"
    },
    medicalLicenceNumber: "MED-001241",
    years_of_experience: 10,
    bio: "Specialist in high-risk pregnancies and maternal health management.",
    created_at: "2024-01-12",
    status: "pending",
  },
  {
    id: 3,
    full_name: "Dr. Michelle Martinez",
    email: "michelle.martinez@example.com",
    phone: "+1-555-0203",
    speciality: {
      id: 3,
      name: "Reproductive Endocrinology"
    },
    medicalLicenceNumber: "MED-001242",
    years_of_experience: 8,
    bio: "Fertility specialist with expertise in reproductive medicine.",
    created_at: "2024-01-08",
    status: "pending",
  },
]

export default function DoctorApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApp, setSelectedApp] = useState<(typeof mockApplications)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch applications on component mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctorApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);


  const filteredApplications = applications.filter(
    (app) =>
      app.status === "pending" &&
      (app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleApprove = (id: number) => {
    approveDoctorApplication(id).then(() => {
      console.log("Application approved:", id)
    }).catch((err) => {
      console.error("Error approving application:", err)
    })
    setApplications(applications.filter((app) => app.id !== id))
  }

  const handleReject = (id: number) => {
    rejectDoctorApplication(id).then(() => {
      console.log("Application rejected:", id)
    }).catch((err) => {
      console.error("Error rejecting application:", err)
    })
    setApplications(applications.filter((app) => app.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Doctor Applications</h1>
        <p className="text-muted-foreground mt-2">Review and manage pending doctor applications</p>
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

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading applications...</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{app.speciality?.name}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span>{app.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">License: </span>
                        <span>{app.medicalLicenceNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Experience: </span>
                        <span>{app.years_of_experience} years</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Applied: </span>
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-3 text-foreground">{app.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedApp(app)
                        setDialogOpen(true)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Review
                    </Button>
                    <Button onClick={() => handleApprove(app.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(app.id)} size="sm" className="bg-red-600 hover:bg-red-700">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedApp && <ApplicationDetailsDialog app={selectedApp} open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  )
}
