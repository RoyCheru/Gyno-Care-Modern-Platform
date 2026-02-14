"use client"

import { useDispatch, useSelector } from "react-redux"
import { Search, MapPin, Stethoscope, X } from "lucide-react";
import { fetchDoctors } from "@/services/doctor.sevice"
import type { RootState } from "@/lib/store"
import { selectDoctor, setCurrentStep, type Doctor } from "@/lib/features/booking-slice"
import React from "react"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { mapDoctorToUI } from "@/lib/features/booking-slice"

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
  const dispatch = useDispatch();
  const selectedDoctor = useSelector(
    (state: RootState) => state.booking.selectedDoctor,
  );

  const handleSelectDoctor = (doctor: Doctor) => {
    dispatch(selectDoctor(doctor));
  };

  const handleContinue = () => {
    if (selectedDoctor) {
      dispatch(setCurrentStep(2));
    }
  };

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await fetchDoctors();
        const mappedDoctors = data.map(mapDoctorToUI);
        setDoctors(mappedDoctors);
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  // Extract unique specialties and locations from doctors
  const specialties = useMemo(() => {
    const uniqueSpecialties = [...new Set(doctors.map(d => d.specialty))]
    return uniqueSpecialties.sort()
  }, [doctors])

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(doctors.map(d => d.location).filter(Boolean))]
    return uniqueLocations.sort()
  }, [doctors])

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      // Specialty filter
      const matchesSpecialty =
        selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;

      // Location filter
      const matchesLocation =
        selectedLocation === "all" || doctor.location === selectedLocation;

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedLocation]);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedSpecialty !== "all" ||
    selectedLocation !== "all";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("all");
    setSelectedLocation("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c94d8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Select Your Doctor
      </h2>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
          />
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-3">
          {/* Specialty Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Filter */}
          {locations.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {filteredDoctors.length}{" "}
            {filteredDoctors.length === 1 ? "doctor" : "doctors"}
            {hasActiveFilters && ` (filtered from ${doctors.length} total)`}
          </p>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "No doctors available at the moment"}
          </p>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-[#c94d8a] text-[#c94d8a] hover:bg-pink-50"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all overflow-hidden hover:shadow-lg ${
                selectedDoctor?.id === doctor.id
                  ? "ring-2 ring-[#c94d8a] bg-pink-50"
                  : "hover:border-[#c94d8a]"
              }`}
              onClick={() => handleSelectDoctor(doctor)}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={"/images/" + (doctor.image || "/placeholder.svg")}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {doctor.name}
                </h3>
                <p className="text-sm text-[#c94d8a] font-medium">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.experience} years experience
                </p>
                {doctor.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{doctor.location}</span>
                  </div>
                )}
                <p className="text-xl font-bold text-gray-900 mt-2">
                  Ksh.{doctor.fee}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedDoctor}
          className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}