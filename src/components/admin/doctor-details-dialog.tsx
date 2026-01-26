"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Doctor {
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


interface DoctorDetailsDialogProps {
  doctor: Doctor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorDetailsDialog({ doctor, open, onOpenChange }: DoctorDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{doctor.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{doctor.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{doctor.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speciality</p>
              <p className="font-medium">{doctor.speciality}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medical License</p>
              <p className="font-medium">{doctor.license}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Years of Experience</p>
              <p className="font-medium">{doctor.yearsExp} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-medium">{new Date(doctor.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                  doctor.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
