"use client"

import { Suspense } from "react"
import { ArticlesContent } from "@/components/admin/articles-content"

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  )
}
