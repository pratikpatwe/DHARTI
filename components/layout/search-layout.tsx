import type React from "react"
import Link from "next/link"
import Image from "next/image"

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://ik.imagekit.io/xnx0c7nxo/DHARTI%20LOGO.png?updatedAt=1745935717643"
                alt="Government Emblem"
                width={50}
                height={50}
                className="h-12 w-12 md:h-16 md:w-16"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-[#00008B]">DHARTI</h1>
                <p className="text-xs md:text-sm text-gray-600">Government of India</p>
              </div>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <Link href="/" className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#resources"
                    className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-[#00008B] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image
                src="https://ik.imagekit.io/xnx0c7nxo/DHARTI%20LOGO.png?updatedAt=17459357176430"
                alt="Government Emblem"
                width={40}
                height={40}
                className="h-10 w-10 bg-white p-1 rounded"
              />
              <div>
                <h3 className="font-bold">DHARTI</h3>
                <p className="text-xs text-white/70">Government of India</p>
              </div>
            </div>

            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Digital India Portal. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
