"use client"

import { Check } from "lucide-react"

interface ProgressBarProps {
  currentStep: number
}

const steps = [
  { number: 1, label: "Select Doctor" },
  { number: 2, label: "Consultation Details" },
  { number: 3, label: "Date & Time" },
  { number: 4, label: "Review & Confirm" },
]

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentStep > step.number
                    ? "bg-[#c94d8a] text-white"
                    : currentStep === step.number
                      ? "bg-[#c94d8a] text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm text-center ${
                  currentStep >= step.number ? "text-[#c94d8a] font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${currentStep > step.number ? "bg-[#c94d8a]" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
