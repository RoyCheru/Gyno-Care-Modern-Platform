"use client"

import { useState, useEffect } from "react"
import { fetchPatients } from "@/services/admin.service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockPatients = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1-555-0301",
    age: 28,
    joinDate: "2023-06-15",
    appointments: 3,
    status: "active",
  },
  {
    id: 2,
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    phone: "+1-555-0302",
    age: 35,
    joinDate: "2023-08-20",
    appointments: 5,
    status: "active",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    phone: "+1-555-0303",
    age: 31,
    joinDate: "2023-11-10",
    appointments: 2,
    status: "inactive",
  },
  {
    id: 4,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    phone: "+1-555-0304",
    age: 26,
    joinDate: "2024-01-05",
    appointments: 1,
    status: "active",
  },
]

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
}


export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPatients();
        
        const normalized: Patient[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          age: p.age,
          joinDate: p.joined_at,
          status: "active", // for now backend does not provide status
        }));

        setPatients(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);


  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Patients</h1>
        <p className="text-muted-foreground mt-2">
          Manage patient accounts and information
        </p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "inactive")
            }
            className="w-full px-4 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold">Age</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Join Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Appointments
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{patient.name}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {patient.age !== null ? patient.age : "—"}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(patient.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">_</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          patient.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() +
                          patient.status.slice(1)}
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
                          <DropdownMenuItem>Medical History</DropdownMenuItem>
                          <DropdownMenuItem>Contact Patient</DropdownMenuItem>
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

      {filteredPatients.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No patients found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
