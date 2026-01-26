"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  speciality: {
    id: number;
    name: string;
  } | null;
  medicalLicenceNumber: string;
  years_of_experience: number;
  bio: string;
  created_at: string;
  status: string;
}

interface ApplicationDetailsDialogProps {
  app: Application
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationDetailsDialog({ app, open, onOpenChange }: ApplicationDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{app.full_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{app.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{app.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speciality</p>
              <p className="font-medium">{app.speciality?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medical License</p>
              <p className="font-medium">{app.medicalLicenceNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Years of Experience</p>
              <p className="font-medium">{app.years_of_experience} years</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Professional Summary</p>
              <p className="font-medium mt-1">{app.bio}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
