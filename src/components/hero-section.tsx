import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-[#f9a8c9] py-12 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Compassionate Gynaecological Care at Your Fingertips
          </h1>
          <p className="mt-6 text-lg text-foreground/80 max-w-xl">
            Access expert resources, community support, and professional care whenever you need it - all in one trusted
            hub
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button className="bg-[#c94d8a] hover:bg-[#b03d78] text-white rounded-full px-8 py-6 text-base font-semibold">
              GET STARTED
            </Button>
            <Link href="/book-consultation">
              <Button
                variant="outline"
                className="border-[#c94d8a] text-[#c94d8a] hover:bg-[#c94d8a]/10 rounded-full px-8 py-6 text-base font-semibold bg-white/50 w-full cursor-pointer"
              >
                BOOK CONSULTATION
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative">
            <Image
              src="/images/hero-doctor.jpg"
              alt="Female gynecologist doctor smiling in white coat with stethoscope"
              width={500}
              height={600}
              className="object-cover rounded-2xl max-h-[500px] md:max-h-[600px] shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
