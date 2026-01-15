"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, Calendar, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Toggle this to test states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 md:px-12 lg:px-20 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-[#c94d8a]">
          Gynocare
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Home
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            About
          </Link>
          <Link href="#services" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Services
          </Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            How It Works
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f9a8c9] hover:bg-[#f490b8] transition-colors"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <User className="w-5 h-5 text-[#c94d8a]" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    href="/bookings"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-[#fdf2f7] hover:text-[#c94d8a] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Calendar className="w-4 h-4" />
                    My Bookings
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-[#fdf2f7] hover:text-[#c94d8a] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-[#fdf2f7] hover:text-[#c94d8a] transition-colors w-full text-left"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      // Sign out logic will be added later
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" className="text-gray-700 hover:text-[#c94d8a] font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#c94d8a] hover:bg-[#b03d78] text-white rounded-full px-6">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 max-w-7xl mx-auto">
          <Link href="#" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Home
          </Link>
          <Link href="#about" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            About
          </Link>
          <Link href="#services" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Services
          </Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            How It Works
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-[#c94d8a] transition-colors font-medium">
            Contact
          </Link>

          <div className="flex flex-col gap-2 mt-2 border-t border-gray-100 pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/bookings"
                  className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:text-[#c94d8a] transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:text-[#c94d8a] transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:text-[#c94d8a] transition-colors font-medium w-full text-left"
                  onClick={() => {
                    setIsOpen(false)
                    // Sign out logic will be added later
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="text-gray-700 justify-start font-medium w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#c94d8a] hover:bg-[#b03d78] text-white rounded-full w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
