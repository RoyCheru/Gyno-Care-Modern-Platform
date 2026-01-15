"use client"

import { Calendar, Clock, DollarSign, User, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"

export type BookingStatus = "Pending" | "Approved" | "Cancelled" | "Rejected"

export interface Booking {
  id: string
  doctorName: string
  doctorSpeciality: string
  date: string
  time: string
  fee: number
  status: BookingStatus
}

interface BookingCardProps {
  booking: Booking
  onCancel?: (id: string) => void
  onPay?: (id: string) => void
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-600",
  Rejected: "bg-red-100 text-red-800",
}

export function BookingCard({ booking, onCancel, onPay }: BookingCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#fdf2f7] flex items-center justify-center">
            <User className="w-6 h-6 text-[#c94d8a]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.doctorName}</h3>
            <div className="flex items-center gap-1 text-[#c94d8a] text-sm">
              <Stethoscope className="w-3 h-3" />
              <span>{booking.doctorSpeciality}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 text-[#c94d8a]" />
          <span className="text-sm">{booking.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4 text-[#c94d8a]" />
          <span className="text-sm">{booking.time}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DollarSign className="w-5 h-5 text-[#c94d8a]" />
          <span className="text-lg font-bold text-gray-900">{booking.fee}</span>
        </div>

        {/* Status-based actions */}
        {booking.status === "Pending" && (
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
            onClick={() => onCancel?.(booking.id)}
          >
            Cancel Appointment
          </Button>
        )}
        {booking.status === "Approved" && (
          <Button className="bg-[#c94d8a] hover:bg-[#b03d78] text-white" onClick={() => onPay?.(booking.id)}>
            Pay Now
          </Button>
        )}
        {/* No actions for Cancelled or Rejected */}
      </div>
    </div>
  )
}
