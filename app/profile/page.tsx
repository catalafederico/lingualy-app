"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  User,
  Mail,
  School,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Camera,
  Bell,
  Shield,
  Globe,
  Download,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@school.edu",
    phone: "+1 (555) 123-4567",
    school: "Lincoln High School",
    department: "English Department",
    gradeLevel: "9-12",
    yearsTeaching: "8",
    location: "San Francisco, CA",
    bio: "Passionate English teacher with 8 years of experience helping students discover the joy of literature and writing. I specialize in creative writing workshops and Shakespeare studies.",
    website: "https://sarahjohnson-english.com",
    subjects: ["Literature", "Creative Writing", "Grammar", "Poetry"],
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    newResourceAlerts: false,
    marketingEmails: false,
    publicProfile: true,
    showEmail: false,
    showPhone: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Profile saved:", { profileData, preferences })
    setIsLoading(false)
    // Show success message or redirect
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested")
      // Handle account deletion
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/80 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:border-gray-700">
        <Link href="/home" className="flex items-center justify-center">
          <div className="relative">
            <Sparkles className="h-10 w-10 text-amber-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
          <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Lingualy
          </span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Button>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
          </div>

          {/* Profile Picture Section */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-lg"
                  >
                    <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{profileData.school}</p>
                  <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    {profileData.gradeLevel} Teacher
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <User className="h-5 w-5 text-amber-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      placeholder="Tell us about yourself and your teaching experience..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <School className="h-5 w-5 text-amber-600" />
                    Professional Information
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your teaching background and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="school" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        School/Institution
                      </Label>
                      <Input
                        id="school"
                        value={profileData.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                        className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gradeLevel" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Grade Level
                      </Label>
                      <Select
                        value={profileData.gradeLevel}
                        onValueChange={(value) => handleInputChange("gradeLevel", value)}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="K-2">Elementary (K-2)</SelectItem>
                          <SelectItem value="3-5">Elementary (3-5)</SelectItem>
                          <SelectItem value="6-8">Middle School (6-8)</SelectItem>
                          <SelectItem value="9-12">High School (9-12)</SelectItem>
                          <SelectItem value="Adult">Adult Education</SelectItem>
                          <SelectItem value="ESL">ESL/EFL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsTeaching" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Years Teaching
                      </Label>
                      <Input
                        id="yearsTeaching"
                        value={profileData.yearsTeaching}
                        onChange={(e) => handleInputChange("yearsTeaching", e.target.value)}
                        className="border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teaching Subjects</Label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.subjects.map((subject, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                        >
                          {subject}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                        + Add Subject
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Website/Portfolio
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 bg-white dark:bg-gray-700"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings & Preferences */}
            <div className="space-y-8">
              {/* Privacy Settings */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Shield className="h-5 w-5 text-amber-600" />
                    Privacy
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Control your profile visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Profile</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Make your profile visible to other teachers
                      </p>
                    </div>
                    <Switch
                      checked={preferences.publicProfile}
                      onCheckedChange={(checked) => handlePreferenceChange("publicProfile", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Email</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display email on public profile</p>
                    </div>
                    <Switch
                      checked={preferences.showEmail}
                      onCheckedChange={(checked) => handlePreferenceChange("showEmail", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Phone</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display phone on public profile</p>
                    </div>
                    <Switch
                      checked={preferences.showPhone}
                      onCheckedChange={(checked) => handlePreferenceChange("showPhone", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Bell className="h-5 w-5 text-amber-600" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage your email preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive important updates</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Digest</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Summary of new resources</p>
                    </div>
                    <Switch
                      checked={preferences.weeklyDigest}
                      onCheckedChange={(checked) => handlePreferenceChange("weeklyDigest", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Resource Alerts
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Instant notifications for new content</p>
                    </div>
                    <Switch
                      checked={preferences.newResourceAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange("newResourceAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Emails</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tips and promotional content</p>
                    </div>
                    <Switch
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Download className="h-5 w-5 text-amber-600" />
                    Account
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage your account data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start border-gray-200 dark:border-gray-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
