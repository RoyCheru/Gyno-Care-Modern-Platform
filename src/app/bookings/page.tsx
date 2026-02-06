"use client"

import { useState, useEffect } from "react"
import { myAppointments } from "@/services/appointment.services"
import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingCard, type Booking } from "@/components/booking-card"
import { Button } from "@/components/ui/button"
import { CalendarX } from "lucide-react"
import { cancelAppointment } from "@/services/appointment.services"

// Mock booking data with different statuses
// const initialBookings: Booking[] = [
//   {
//     id: "1",
//     doctorName: "Dr. Sarah Johnson",
//     doctorSpeciality: "Obstetrics & Gynecology",
//     date: "January 15, 2026",
//     time: "10:00 AM",
//     fee: 150,
//     status: "Pending",
//   },
//   {
//     id: "2",
//     doctorName: "Dr. Emily Chen",
//     doctorSpeciality: "Reproductive Endocrinology",
//     date: "January 18, 2026",
//     time: "2:30 PM",
//     fee: 200,
//     status: "Approved",
//   },
//   {
//     id: "3",
//     doctorName: "Dr. Maria Rodriguez",
//     doctorSpeciality: "Gynecologic Oncology",
//     date: "January 10, 2026",
//     time: "11:00 AM",
//     fee: 180,
//     status: "Cancelled",
//   },
//   {
//     id: "4",
//     doctorName: "Dr. Amanda Williams",
//     doctorSpeciality: "Maternal-Fetal Medicine",
//     date: "January 8, 2026",
//     time: "9:00 AM",
//     fee: 175,
//     status: "Rejected",
//   },
// ]


export default function BookingsPage() {

  useEffect(() => {
    async function fetchBookings() {
      try {
        const appointments = await myAppointments();
        const formattedBookings = appointments.map((appointment: any) => ({
          id: appointment.id,
          doctorName: appointment.doctor?.user?.name ?? "Unknown Doctor",
          doctorSpeciality: appointment.doctor.speciality?.name ?? "",
          date: new Date(appointment.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: appointment.appointment_time,
          fee: appointment.doctor.consultation_fee,
          status: appointment.status as Booking["status"],
        }));
        // remove cancelled bookings from the list
        const activeBookings = formattedBookings.filter((booking: Booking) => booking.status !== "Cancelled");
        setBookings(activeBookings);
        console.log("formated bookings:", activeBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    

    fetchBookings();
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([])
  
  const handleCancel = (id: string) => {
    // Here you would typically call an API to cancel the booking
    cancelAppointment(id);
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status: "Cancelled" as const } : booking)),
    )
  }

  const handlePay = (id: string) => {
    // Payment logic would go here
    alert(`Processing payment for booking ${id}`)
  }

  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

          {bookings.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#fdf2f7] flex items-center justify-center mx-auto mb-4">
                <CalendarX className="w-8 h-8 text-[#c94d8a]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">You have no bookings yet</h2>
              <p className="text-gray-600 mb-6">Book a consultation with one of our trusted gynecologists today.</p>
              <Link href="/book-consultation">
                <Button className="bg-[#c94d8a] hover:bg-[#b03d78] text-white rounded-full px-8">
                  Book Consultation
                </Button>
              </Link>
            </div>
          ) : (
            // Bookings list
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} onPay={handlePay} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
