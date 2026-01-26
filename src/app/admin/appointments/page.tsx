"use client"

import { Suspense } from "react"
import { AppointmentsContent } from "@/components/admin/appointments-content"

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <AppointmentsContent />
    </Suspense>
  )
}
