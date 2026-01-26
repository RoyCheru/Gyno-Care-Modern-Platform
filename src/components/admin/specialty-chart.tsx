"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SpecialtyChart() {
  const specialtyData = [
    { specialty: "Gynecology", consultations: 156 },
    { specialty: "Obstetrics", consultations: 143 },
    { specialty: "Fertility", consultations: 98 },
    { specialty: "Oncology", consultations: 67 },
    { specialty: "Dermatology", consultations: 54 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Consulted Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={specialtyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="specialty" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="consultations" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
