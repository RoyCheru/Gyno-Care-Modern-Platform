"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fetchCurrentUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { loginSuccess } from "@/lib/features/auth-slice";
import { useDispatch } from "react-redux";


export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(formData.email, formData.password);

      const { access_token } = response.data;
      console.log(response.data);
      // save token
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", access_token);
      }

      const user = await fetchCurrentUser();
      console.log(user.role);

      // update redux
      dispatch(loginSuccess(user));

      // redirect
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
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
            Welcome Back to Gynocare
          </h1>
          <p className="text-[#1a1a1a]/80 text-lg">
            Your trusted partner in women's health. Sign in to access your
            appointments, medical records, and connect with our expert
            gynecologists.
          </p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-[#c94d8a]">
              Gynocare
            </Link>
            <h2 className="text-2xl font-semibold text-[#1a1a1a] mt-6">
              Sign In
            </h2>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c94d8a] focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#c94d8a] focus:ring-[#c94d8a]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-[#c94d8a] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c94d8a] hover:bg-[#b03d78] text-white py-3 rounded-full font-semibold text-lg disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-[#c94d8a] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
