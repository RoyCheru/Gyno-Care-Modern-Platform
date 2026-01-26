"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setSelectedDate, setSelectedTime, setCurrentStep } from "@/lib/features/booking-slice"
import { fetchBookedSlots } from "@/services/doctor.sevice"
import React from "react"
import { useEffect, useState } from "react" 
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

const availableDates = [
  { date: "2026-01-23", display: "Fri, Jan 23" },
  { date: "2026-01-24", display: "Sat, Jan 24" },
  { date: "2026-01-25", display: "Mon, Jan 25" },
  { date: "2026-01-26", display: "Tue, Jan 26" },
  { date: "2026-01-27", display: "Wed, Jan 27" },
]

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
]


export function SelectDateTime() {
  const dispatch = useDispatch();
  const { selectedDate, selectedTime } = useSelector(
    (state: RootState) => state.booking
  );
  const [ bookedSlots, setBookedSlots ] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const doctorId = useSelector((state: RootState) => state.booking.selectedDoctor?.id);

  const handleBack = () => {
    dispatch(setCurrentStep(2));
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      dispatch(setCurrentStep(4));
    }
  };

  // helper function to convert "10:00 AM" to "10:00"
  const to24Hour = (time: string) => {
    const date = new Date(`1970-01-01 ${time}`);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // fetch booked slots based on selected date and doctor
  useEffect(() => {
    if (!selectedDate || !doctorId) return;

    setLoadingSlots(true);

    fetchBookedSlots(doctorId, selectedDate)
      .then((slots) => {
        setBookedSlots(slots);
        dispatch(setSelectedTime(null)); // reset time when date changes
      })
      .catch((err) => {
        console.error("Failed to fetch booked slots:", err);
        setBookedSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate, doctorId, dispatch]);
  console.log("bookedSlots:", bookedSlots);
  console.log("selectedDate:", selectedDate);



// helper function to filter out booked slots
  const normalized = bookedSlots.map((time) => to24Hour(time));
  const isSlotBooked = (time: string) => {
    return normalized.includes(to24Hour(time));
    // return bookedSlots.map(normalizeTime).includes(normalizeTime(time));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Select Date & Time
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c94d8a]" />
            Available Dates
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableDates.map((item) => (
              <Card
                key={item.date}
                className={`cursor-pointer transition-all ${
                  selectedDate === item.date
                    ? "ring-2 ring-[#c94d8a] bg-pink-50"
                    : "hover:border-[#c94d8a]"
                }`}
                onClick={() => dispatch(setSelectedDate(item.date))}
              >
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900">{item.display}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Time Slots
          </h3>

          {loadingSlots ? (
            <p className="text-sm text-gray-500">Loading available slots…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {timeSlots.map((time) => {
                const booked = isSlotBooked(time);

                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    disabled={booked}
                    className={`
              ${
                selectedTime === time
                  ? "bg-[#c94d8a] hover:bg-[#a73d72] text-white"
                  : "hover:border-[#c94d8a] hover:text-[#c94d8a]"
              }
              ${booked ? "opacity-50 cursor-not-allowed" : ""}
            `}
                    onClick={() => {
                      if (!booked) {
                        dispatch(setSelectedTime(time));
                      }
                    }}
                  >
                    {time}
                    {booked && <span className="ml-2 text-xs">(Booked)</span>}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          className="px-8 bg-transparent"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
