"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setCurrentStep, resetBooking } from "@/lib/features/booking-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, FileText, Calendar, DollarSign, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { createAppointment } from "@/services/appointment.services"
import { useRouter } from "next/navigation"

export function ReviewConfirm() {
  const dispatch = useDispatch()
  const { selectedDoctor, healthConcern, medicalAttachment, selectedDate, selectedTime } = useSelector(
    (state: RootState) => state.booking,
  )
  const [isConfirmed, setIsConfirmed] = useState(false)
  const router = useRouter();

  const handleBack = () => {
    dispatch(setCurrentStep(3))
  }

  const handleConfirm = async () => {
    // Here you would typically send the booking data to your backend server
    try {
      const token = localStorage.getItem("access_token");
       if (!token) {
      router.push("/login")
      return
    }
    const newBooking = {
      doctor_id: selectedDoctor?.id || "",
      reason: healthConcern,
      date: selectedDate,
      slot: selectedTime,
    };
    await createAppointment(newBooking);
    setIsConfirmed(true)
    router.push("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    }
  }

  const handleNewBooking = () => {
    dispatch(resetBooking())
    setIsConfirmed(false)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isConfirmed) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your consultation with {selectedDoctor?.name} has been successfully booked. You will receive a confirmation
          email shortly.
        </p>
        <Button onClick={handleNewBooking} className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8">
          Book Another Consultation
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Confirm</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#c94d8a]" />
              Selected Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDoctor && (
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={selectedDoctor.image || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
                  <p className="text-sm text-[#c94d8a]">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.experience} years experience</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#c94d8a]" />
              Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
            <p className="text-[#c94d8a] font-semibold">{selectedTime}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c94d8a]" />
              Consultation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{healthConcern}</p>
            {medicalAttachment && (
              <p className="text-sm text-gray-500 mt-3">
                Attachment: <span className="text-[#c94d8a]">{medicalAttachment}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-pink-50 border-[#c94d8a]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#c94d8a]" />
                <span className="text-lg font-medium text-gray-900">Consultation Fee</span>
              </div>
              <span className="text-2xl font-bold text-[#c94d8a]">${selectedDoctor?.fee}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="px-8 bg-transparent">
          Back
        </Button>
        <Button onClick={handleConfirm} className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8">
          Confirm Booking
        </Button>
      </div>
    </div>
  )
}
