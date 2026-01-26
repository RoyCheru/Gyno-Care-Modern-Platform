"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TopDoctorsTable() {
  const topDoctors = [
    { rank: 1, name: "Dr. Sarah Johnson", specialty: "Gynecology", consultations: 67 },
    { rank: 2, name: "Dr. Emily Chen", specialty: "Obstetrics", consultations: 54 },
    { rank: 3, name: "Dr. Aisha Patel", specialty: "Fertility", consultations: 48 },
    { rank: 4, name: "Dr. Lisa Anderson", specialty: "Gynecology", consultations: 42 },
    { rank: 5, name: "Dr. Rachel Moore", specialty: "Oncology", consultations: 35 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Doctors by Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Rank</th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Doctor Name</th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Specialty</th>
                <th className="text-left text-sm font-medium text-muted-foreground py-3 px-4">Consultations</th>
              </tr>
            </thead>
            <tbody>
              {topDoctors.map((doctor) => (
                <tr key={doctor.rank} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600 font-bold text-sm">
                      {doctor.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-sm">{doctor.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{doctor.specialty}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{doctor.consultations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
