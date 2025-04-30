import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, User, FileText } from "lucide-react"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"

export default function ProtectedPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <SearchLayout>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="border-2 border-[#00008B]/10 mb-6">
          <CardHeader className="bg-[#00008B]/5">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00008B]" />
              <CardTitle className="text-2xl text-[#00008B]">Protected Area</CardTitle>
            </div>
            <CardDescription>This page is only accessible to authenticated users</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-6 flex items-start">
              <User className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800 mb-1">Authentication Successful</h3>
                <p className="text-sm text-green-700">
                  You have successfully authenticated and can now access protected content and features.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Your Secure Dashboard</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#00008B]/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <div>
                    <h4 className="font-medium">My Properties</h4>
                    <p className="text-sm text-gray-500">View and manage your saved properties</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  Access Properties
                </Button>
              </div>

              <div className="bg-white p-4 rounded-md border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#FF9933]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Account Settings</h4>
                    <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  Manage Account
                </Button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/">
                <Button className="bg-[#00008B] hover:bg-blue-900">Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SearchLayout>
  )
}
