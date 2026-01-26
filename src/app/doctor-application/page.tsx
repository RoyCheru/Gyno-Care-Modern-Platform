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
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    speciality: "",
    yearsOfExperience: "",
    medicalLicense: "",
    bio: "",
  });

  interface Speciality {
    id: number;
    name: string;
  }


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
      }
    };

    loadSpecialities();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        speciality_id: Number(formData.speciality),
        years_of_experience: Number(formData.yearsOfExperience),
        medicalLicenceNumber: formData.medicalLicense,
        bio: formData.bio,
      };

      await makeDoctorApplication(payload);

      setIsSubmitted(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Doctor application failed:", error);
      alert("Failed to submit application. Please try again.");
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
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
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
                  placeholder="Enter years of experience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
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
                  placeholder="Enter your medical license number"
                  value={formData.medicalLicense}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">
                Professional Summary <span className="text-[#c94d8a]">*</span>
              </Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Write a brief professional summary..."
                value={formData.bio}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 bg-[#c94d8a] hover:bg-[#b03d78] text-white py-3 rounded-lg font-semibold"
              >
                Submit Application
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
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
