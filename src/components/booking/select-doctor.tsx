"use client"

import { useDispatch, useSelector } from "react-redux"
import { fetchDoctors } from "@/services/doctor.sevice"
import type { RootState } from "@/lib/store"
import { selectDoctor, setCurrentStep, type Doctor } from "@/lib/features/booking-slice"
import React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// const doctors: Doctor[] = [
//   {
//     id: "1",
//     name: "Dr. Sarah Johnson",
//     specialty: "Obstetrics & Gynecology",
//     experience: 12,
//     fee: 150,
//     image: "/female-doctor-portrait-professional.png",
//   },
//   {
//     id: "2",
//     name: "Dr. Emily Chen",
//     specialty: "Reproductive Endocrinology",
//     experience: 8,
//     fee: 180,
//     image: "/asian-female-doctor-smiling.jpg",
//   },
//   {
//     id: "3",
//     name: "Dr. Amanda Williams",
//     specialty: "Maternal-Fetal Medicine",
//     experience: 15,
//     fee: 200,
//     image: "/african-american-female-doctor.jpg",
//   },
//   {
//     id: "4",
//     name: "Dr. Rachel Martinez",
//     specialty: "Gynecologic Oncology",
//     experience: 10,
//     fee: 175,
//     image: "/latina-female-doctor-professional.jpg",
//   },
//   {
//     id: "5",
//     name: "Dr. Lisa Thompson",
//     specialty: "Urogynecology",
//     experience: 9,
//     fee: 160,
//     image: "/female-gynecologist-doctor.jpg",
//   },
//   {
//     id: "6",
//     name: "Dr. Michelle Davis",
//     specialty: "Adolescent Gynecology",
//     experience: 7,
//     fee: 140,
//     image: "/young-female-doctor-friendly.jpg",
//   },
// ]

export function SelectDoctor() {
  const dispatch = useDispatch()
  const selectedDoctor = useSelector((state: RootState) => state.booking.selectedDoctor)

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(selectDoctor(doctor))
  }

  const handleContinue = () => {
    if (selectedDoctor) {
      dispatch(setCurrentStep(2))
    }
  }

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const fetchedDoctors = await fetchDoctors()
        setDoctors(fetchedDoctors)
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }
    loadDoctors()
  }, [])

  if (loading) {
    return <div>Loading doctors...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Doctor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className={`cursor-pointer transition-all overflow-hidden hover:shadow-lg ${
              selectedDoctor?.id === doctor.id ? "ring-2 ring-[#c94d8a] bg-pink-50" : "hover:border-[#c94d8a]"
            }`}
            onClick={() => handleSelectDoctor(doctor)}
          >
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              {/* <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" /> */}
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
              <p className="text-sm text-[#c94d8a] font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
              <p className="text-xl font-bold text-gray-900 mt-2">${doctor.fee}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedDoctor}
          className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
