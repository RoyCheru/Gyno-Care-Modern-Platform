"use client";

import type React from "react";

import { useState } from "react";
import { registerUser } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [accountType] = useState<"patient">("patient");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing
    if (error) setError(null);
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };;

  const validateForm = (): boolean => {
    // Check for empty fields
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }

    if (formData.fullName.trim().length < 4) {
      setError("Full name must be at least 4 characters");
      return false;
    }

    if (!formData.email) {
      setError("Please enter your email");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Please enter a password");
      return false;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        accountType, // "patient"
      });

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle different error scenarios
      if (err?.response?.status === 400) {
        // Bad request - could be missing fields or email already registered
        const errorMessage = err?.response?.data?.error;
        if (
          errorMessage?.toLowerCase().includes("already registered") ||
          errorMessage?.toLowerCase().includes("already exists")
        ) {
          setError(
            "This email is already registered. Please sign in or use a different email.",
          );
        } else if (errorMessage?.toLowerCase().includes("missing")) {
          setError("Please fill in all required fields");
        } else {
          setError(errorMessage || "Invalid registration details");
        }
      } else if (err?.response?.status === 500) {
        // Server error
        setError("Server error. Please try again later");
      } else if (err?.code === "ERR_NETWORK" || !err?.response) {
        // Network error or no response
        setError(
          "Unable to connect to server. Please check your internet connection",
        );
      } else {
        // Generic error
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Registration failed. Please try again",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f9a8c9] flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Join Gynocare Today
          </h1>
          <p className="text-[#1a1a1a]/80 text-lg">
            Create your account to access compassionate gynaecological care.
            Connect with trusted doctors, book appointments, and take control of
            your health journey.
          </p>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-[#c94d8a]">
              Gynocare
            </Link>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mt-6">
              Patient Sign Up
            </h2>
            <p className="text-gray-600 mt-2">
              Fill in your details to get started
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Are you a doctor?{" "}
              <Link
                href="/doctor-application"
                className="text-[#c94d8a] font-medium hover:underline"
              >
                Submit your application here
              </Link>
            </p>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                Account created successfully!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to sign in...
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && !showSuccess && (
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (error && e.target.checked) setError(null);
                }}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#c94d8a] focus:ring-[#c94d8a]"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-[#c94d8a] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#c94d8a] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#c94d8a] hover:bg-[#b03d78] text-white py-3 rounded-full font-semibold text-lg disabled:opacity-70"
              disabled={isLoading || showSuccess}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#c94d8a] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
