import type React from "react"
import type { Metadata } from "next"
import { ReduxProvider } from "@/lib/redux-provider"

export const metadata: Metadata = {
  title: "Book Consultation - Gynocare",
  description: "Book an online consultation with our trusted gynecologists.",
}

export default function BookConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReduxProvider>{children}</ReduxProvider>
}
