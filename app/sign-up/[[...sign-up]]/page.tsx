import { SignUp } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignUpPage() {
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
          {/* Left column - Sign Up Form */}
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

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create an Account</h2>
            <p className="text-gray-600 mb-8">Join DHARTI to access digital property records and services</p>

            <div className="w-full">
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-[#00008B] hover:bg-blue-900 text-white",
                    footerActionLink: "text-[#00008B] hover:text-[#FF9933]",
                    card: "shadow-none",
                  },
                }}
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
              />
            </div>
          </div>

          {/* Right column - Image and Info */}
          <div className="hidden md:block relative bg-gradient-to-br from-[#FF9933] to-[#138808]">
            <div className="absolute inset-0 bg-opacity-80 flex flex-col justify-center p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Benefits of Registration</h3>
              <p className="mb-6">Create an account to unlock the full potential of DHARTI's digital services.</p>

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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Save Property Records</h4>
                    <p className="text-sm text-white/80">Save and track property information for future reference</p>
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Receive Notifications</h4>
                    <p className="text-sm text-white/80">Get alerts about property updates and changes</p>
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Additional Services</h4>
                    <p className="text-sm text-white/80">Access premium features and government services</p>
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
