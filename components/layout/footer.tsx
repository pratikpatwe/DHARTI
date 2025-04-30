import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#00008B] text-white py-12 print:hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://ik.imagekit.io/xnx0c7nxo/DHARTI%20LOGO.png?updatedAt=1745935717643"
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
              Empowering citizens through digital transformation of government services.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#resources" className="text-white/70 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-white/70 mb-4">
              Subscribe to our newsletter to receive updates on new services and features.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-[#FF9933] hover:bg-[#FF8C00] text-white">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/70 mb-4 md:mb-0">
            © {new Date().getFullYear()} DHARTI. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-white/70 hover:text-white transition-colors">
              Website Policies
            </Link>
            <Link href="#" className="text-xs text-white/70 hover:text-white transition-colors">
              Accessibility Statement
            </Link>
            <Link href="#" className="text-xs text-white/70 hover:text-white transition-colors">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
