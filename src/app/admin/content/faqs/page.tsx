"use client"

import { Suspense } from "react"
import { FAQsContent } from "@/components/admin/faqs-content"

export default function FAQsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <FAQsContent />
    </Suspense>
  )
}
