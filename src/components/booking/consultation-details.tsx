"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setHealthConcern, setMedicalAttachment, setCurrentStep } from "@/lib/features/booking-slice"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

export function ConsultationDetails() {
  const dispatch = useDispatch()
  const { healthConcern, medicalAttachment } = useSelector((state: RootState) => state.booking)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      dispatch(setMedicalAttachment(file.name))
    }
  }

  const handleBack = () => {
    dispatch(setCurrentStep(1))
  }

  const handleContinue = () => {
    if (healthConcern.trim()) {
      dispatch(setCurrentStep(3))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consultation Details</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="health-concern" className="text-base font-medium text-gray-900">
            Describe your health concern <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="health-concern"
            placeholder="Please describe your symptoms, concerns, or questions for the doctor..."
            value={healthConcern}
            onChange={(e) => dispatch(setHealthConcern(e.target.value))}
            className="mt-2 min-h-[150px] resize-none"
          />
        </div>
        <div>
          <Label htmlFor="medical-attachment" className="text-base font-medium text-gray-900">
            Medical Attachment (Optional)
          </Label>
          <div className="mt-2">
            <label
              htmlFor="medical-attachment"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#c94d8a] hover:bg-pink-50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {medicalAttachment ? (
                    <span className="text-[#c94d8a] font-medium">{medicalAttachment}</span>
                  ) : (
                    <>
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
              <Input
                id="medical-attachment"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack} className="px-8 bg-transparent">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!healthConcern.trim()}
          className="bg-[#c94d8a] hover:bg-[#a73d72] text-white px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
