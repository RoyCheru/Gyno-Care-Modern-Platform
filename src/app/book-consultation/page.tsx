"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { ProgressBar } from "@/components/booking/progress-bar"
import { SelectDoctor } from "@/components/booking/select-doctor"
import { ConsultationDetails } from "@/components/booking/consultation-details"
import { SelectDateTime } from "@/components/booking/select-date-time"
import { ReviewConfirm } from "@/components/booking/review-confirm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BookConsultationPage() {
  const currentStep = useSelector((state: RootState) => state.booking.currentStep)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectDoctor />
      case 2:
        return <ConsultationDetails />
      case 3:
        return <SelectDateTime />
      case 4:
        return <ReviewConfirm />
      default:
        return <SelectDoctor />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#c94d8a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Book Consultation</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={currentStep} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">{renderStep()}</div>
        </div>
      </main>
    </div>
  )
}
