"use client"

import { Suspense } from "react"
import { ReportsContent } from "@/components/admin/reports-content"

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ReportsContent />
    </Suspense>
  )
}
