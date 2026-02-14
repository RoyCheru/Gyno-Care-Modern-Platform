"use client";

import type React from "react";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { makeDoctorApplication } from "@/services/doctor.sevice";
import { fetchSpecialities } from "@/services/speciality.service";

export default function DoctorApplicationPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    speciality: "",
    yearsOfExperience: "",
    medicalLicense: "",
    bio: "",
    location: "",
  });

  interface Speciality {
    id: number;
    name: string;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    // Clear error when user starts typing
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loadSpecialities = async () => {
      try {
        const data = await fetchSpecialities();
        setSpecialities(data);
      } catch (error) {
        console.error("Failed to load specialities:", error);
        setError("Failed to load specialities. Please refresh the page.");
      }
    };

    loadSpecialities();
  }, []);

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setError("Please enter a valid full name (at least 3 characters)");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    if (!formData.speciality) {
      setError("Please select a speciality");
      return false;
    }

    const experience = Number(formData.yearsOfExperience);
    if (isNaN(experience) || experience < 0 || experience > 60) {
      setError("Please enter valid years of experience (0-60)");
      return false;
    }

    if (
      !formData.medicalLicense.trim() ||
      formData.medicalLicense.trim().length < 3
    ) {
      setError("Please enter a valid medical license number");
      return false;
    }

    if (!formData.location.trim() || formData.location.trim().length < 3) {
      setError("Please enter your location or hospital name");
      return false;
    }

    if (!formData.bio.trim() || formData.bio.trim().length < 50) {
      setError(
        "Please provide a professional summary (at least 50 characters)",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        speciality_id: Number(formData.speciality),
        years_of_experience: Number(formData.yearsOfExperience),
        medicalLicenceNumber: formData.medicalLicense,
        bio: formData.bio,
        location: formData.location,
      };

      await makeDoctorApplication(payload);

      setIsSubmitted(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      console.error("Doctor application failed:", err);

      // Handle different error scenarios
      if (err?.response?.status === 400) {
        const errorMessage = err?.response?.data?.error;
        if (
          errorMessage?.toLowerCase().includes("already exists") ||
          errorMessage?.toLowerCase().includes("already registered")
        ) {
          setError(
            "An application with this email already exists. Please check your email or contact support.",
          );
        } else if (errorMessage?.toLowerCase().includes("missing")) {
          setError("Please fill in all required fields");
        } else {
          setError(
            errorMessage ||
              "Invalid application details. Please check your information.",
          );
        }
      } else if (err?.response?.status === 500) {
        setError("Server error. Please try again later or contact support.");
      } else if (err?.code === "ERR_NETWORK" || !err?.response) {
        setError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to submit application. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#c94d8a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#c94d8a]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                Application Submitted
              </h2>
              <p className="text-gray-600">
                Your application has been submitted and is pending approval. We
                will review your credentials and contact you soon. You will be
                able to sign in once your application is approved.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
              Doctor Application
            </h1>
            <p className="text-gray-600">
              Submit your professional details for verification. You will
              receive approval status via email.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name <span className="text-[#c94d8a]">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email <span className="text-[#c94d8a]">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-gray-700 font-medium"
                >
                  Phone Number <span className="text-[#c94d8a]">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="e.g., 0712345678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="speciality"
                  className="text-gray-700 font-medium"
                >
                  Speciality <span className="text-[#c94d8a]">*</span>
                </Label>
                <select
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent bg-white"
                >
                  <option value="">Select a speciality</option>
                  {specialities.map((speciality) => (
                    <option key={speciality.id} value={speciality.id}>
                      {speciality.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="yearsOfExperience"
                  className="text-gray-700 font-medium"
                >
                  Years of Experience <span className="text-[#c94d8a]">*</span>
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="e.g., 5"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="medicalLicense"
                  className="text-gray-700 font-medium"
                >
                  Medical License Number{" "}
                  <span className="text-[#c94d8a]">*</span>
                </Label>
                <Input
                  id="medicalLicense"
                  name="medicalLicense"
                  type="text"
                  placeholder="Enter your license number"
                  value={formData.medicalLicense}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">
                Location / Hospital <span className="text-[#c94d8a]">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Nairobi Hospital, Westlands or Nairobi, Karen"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your hospital name or general location where you practice
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">
                Professional Summary <span className="text-[#c94d8a]">*</span>
              </Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Write a brief professional summary (minimum 50 characters)..."
                value={formData.bio}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/50 characters minimum
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#c94d8a] hover:bg-[#b03d78] text-white py-3 rounded-lg font-semibold disabled:opacity-70"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-semibold border-gray-300 bg-transparent"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}