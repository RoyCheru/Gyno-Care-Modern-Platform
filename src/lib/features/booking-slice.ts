import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  fee: number
  image: string | null
}

export interface BackendDoctor {
  id: number
  status: string
  experience_years: number
  currency: string
  consultation_fee: number
  profile_picture: string | null

  user: {
    id: number
    name: string
    email: string
  }

  speciality: {
    id: number
    name: string
  }
}

export function mapDoctorToUI(doctor: BackendDoctor): Doctor {
  return {
    id: doctor.id.toString(),
    name: doctor.user.name,
    specialty: doctor.speciality.name,
    experience: doctor.experience_years,
    fee: doctor.consultation_fee,
    image: doctor.profile_picture,
  }
}

export interface BookingState {
  currentStep: number
  selectedDoctor: Doctor | null
  healthConcern: string
  medicalAttachment: string | null
  selectedDate: string | null
  selectedTime: string | null
}

const initialState: BookingState = {
  currentStep: 1,
  selectedDoctor: null,
  healthConcern: "",
  medicalAttachment: null,
  selectedDate: null,
  selectedTime: null,
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    selectDoctor: (state, action: PayloadAction<Doctor>) => {
      state.selectedDoctor = action.payload
    },
    setHealthConcern: (state, action: PayloadAction<string>) => {
      state.healthConcern = action.payload
    },
    setMedicalAttachment: (state, action: PayloadAction<string | null>) => {
      state.medicalAttachment = action.payload
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setSelectedTime: (state, action: PayloadAction<string | null>) => {
      state.selectedTime = action.payload
    },
    resetBooking: () => initialState,
  },
})

export const {
  setCurrentStep,
  selectDoctor,
  setHealthConcern,
  setMedicalAttachment,
  setSelectedDate,
  setSelectedTime,
  resetBooking,
} = bookingSlice.actions

export default bookingSlice.reducer
