import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Gynocare</h3>
            <p className="text-background/70 mb-4">
              Compassionate gynaecological care at your fingertips. Your trusted partner in women's health.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/book-consultation" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-[#f9a8c9] transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Mail size={16} />
                <span>support@gynocare.com</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone size={16} />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-background/70">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>123 Healthcare Ave, Medical District, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Gynocare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
