"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Trash2, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockFAQs = [
  {
    id: 1,
    question: "What should I expect during my first consultation?",
    category: "Consultations",
    helpful: 234,
    status: "published",
  },
  {
    id: 2,
    question: "How do I book an appointment?",
    category: "Booking",
    helpful: 456,
    status: "published",
  },
  {
    id: 3,
    question: "What payment methods are accepted?",
    category: "Payments",
    helpful: 189,
    status: "published",
  },
  {
    id: 4,
    question: "Can I reschedule my appointment?",
    category: "Appointments",
    helpful: 312,
    status: "draft",
  },
]

export function FAQsContent() {
  const [faqs, setFAQs] = useState(mockFAQs)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredFAQs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FAQs</h1>
          <p className="text-muted-foreground mt-2">Manage frequently asked questions</p>
        </div>
        <Button className="bg-[#c94d8a] hover:bg-[#b03d78]">
          <Plus className="w-4 h-4 mr-2" />
          New FAQ
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="flex items-center gap-2 font-medium text-foreground hover:text-[#c94d8a] transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedId === faq.id ? "rotate-180" : ""}`}
                    />
                    {faq.question}
                  </button>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-muted-foreground">Category: {faq.category}</span>
                    <span className="text-muted-foreground">Helpful: {faq.helpful}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        faq.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {faq.status.charAt(0).toUpperCase() + faq.status.slice(1)}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      ...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
