"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sparkles,
  User,
  Mail,
  MapPin,
  Phone,
  Save,
  ArrowLeft,
  Camera,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserProfile, type UserProfile } from "@/services/auth/user-profile"
import { isAuthenticated as checkIsAuthenticated } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    country: "",
  })

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria",
    "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
    "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
    "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway",
    "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
    "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
  ]

  const [isLoading, setIsLoading] = useState(false)

  // Check authentication and fetch user data
  useEffect(() => {
    if (!checkIsAuthenticated()) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setIsLoadingAuth(false)

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile()
        setProfileData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: "", // Not in API response
          country: profile.country || "",
        })
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Keep empty strings as fallback
      }
    }

    fetchUserProfile()
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Profile saved:", { profileData })
    setIsLoading(false)
    // Show success message or redirect
  }

  // Show loading screen while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-amber-600 animate-spin mx-auto" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
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

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Manage your personal information and account details</p>
          </div>

          {/* Unified Profile Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100 text-xl mb-4">
                  <User className="h-6 w-6 text-amber-600" />
                  Personal Information
                </CardTitle>
                
                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Camera className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload profile picture</p>
                  </div>
                </div>

                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                {/* Visual Separator */}
                <Separator className="my-3" />
                
                {/* Name Section */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-11 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-11 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-11 pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700"
                        placeholder="Enter your email address"
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
                        className="h-11 pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section - Inline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Country
                    </Label>
                    <div className="relative w-full">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Select
                        value={profileData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                      >
                        <SelectTrigger className="w-full h-[44px] pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700 !h-[44px] min-h-[44px] max-h-[44px]">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 w-full">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      City/State
                    </Label>
                    <div className="relative w-full">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full h-11 pl-10 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-gray-700"
                        placeholder="Enter your city and state"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button Section */}
                <div className="pt-5 mt-5 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-3" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
