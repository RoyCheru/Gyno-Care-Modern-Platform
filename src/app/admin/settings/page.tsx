"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Gynocare",
    email: "admin@gynocare.com",
    phone: "+1-555-0000",
    maintenanceMode: false,
    emailNotifications: true,
  })

  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSave = () => {
    setSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Manage admin dashboard settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Support Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="maintenanceMode" className="cursor-pointer">
                Enable Maintenance Mode
              </Label>
            </div>
            {formData.maintenanceMode && (
              <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Maintenance mode will prevent patients from accessing the platform. Use this during updates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="emailNotifications" className="cursor-pointer">
                Receive Email Notifications for New Applications
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-700">These actions cannot be undone. Proceed with caution.</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100 bg-transparent">
                Clear All Logs
              </Button>
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100 bg-transparent">
                Reset Statistics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="bg-[#c94d8a] hover:bg-[#b03d78]">
            Save Changes
          </Button>
          {saved && <span className="text-green-600 flex items-center">Settings saved successfully</span>}
        </div>
      </div>
    </div>
  )
}
