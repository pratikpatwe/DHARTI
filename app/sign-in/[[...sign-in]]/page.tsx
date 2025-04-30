import { SignIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Left column - Sign In Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-8 flex items-center">
              <Image
                src="https://ik.imagekit.io/xnx0c7nxo/DHARTI%20LOGO.png?updatedAt=1745935717643"
                alt="DHARTI Logo"
                width={50}
                height={50}
                className="mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#00008B]">DHARTI</h1>
                <p className="text-sm text-gray-600">Government of India</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to access your account and property information</p>

            <div className="w-full">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-[#00008B] hover:bg-blue-900 text-white",
                    footerActionLink: "text-[#00008B] hover:text-[#FF9933]",
                    card: "shadow-none",
                  },
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
              />
            </div>
          </div>

          {/* Right column - Image and Info */}
          <div className="hidden md:block relative bg-gradient-to-br from-[#00008B] to-[#138808]">
            <div className="absolute inset-0 bg-opacity-80 flex flex-col justify-center p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Secure Access to Digital Property Records</h3>
              <p className="mb-6">
                Access comprehensive property information through our secure and efficient digital platform.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Authentication</h4>
                    <p className="text-sm text-white/80">Your data is protected with industry-standard security</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Verified Information</h4>
                    <p className="text-sm text-white/80">Access to government-verified property records</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 flex items-center">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
              </div>
              <span className="ml-2 text-xs text-white/80">Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} DHARTI - Digital Housing & Asset Registry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
