"use client"

import Link from "next/link"
import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { logout } from "@/lib/features/auth-slice"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare, Settings, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Doctor Management",
    icon: Users,
    submenu: [
      { label: "All Doctors", href: "/admin/doctors" },
      { label: "Applications", href: "/admin/doctor-applications" },
    ],
  },
  {
    label: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    label: "Health Content",
    icon: FileText,
    submenu: [
      { label: "Articles", href: "/admin/content/articles" },
      { label: "FAQs", href: "/admin/content/faqs" },
    ],
  },
  {
    label: "Reports & Complaints",
    href: "/admin/reports",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/signin")
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="text-2xl font-bold text-[#c94d8a]">
          Gynocare
        </Link>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const hasSubmenu = "submenu" in item

          if (hasSubmenu) {
            const isExpanded = expandedMenu === item.label

            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isExpanded
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border/50 pl-3">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          pathname === subitem.href
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span >Logout</span>
        </button>
      </div>
    </div>
  )
}
