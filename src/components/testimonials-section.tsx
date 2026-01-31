'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    image: '/images/testimonial-1.jpg',
    quote: 'GynoCare made managing my health so much easier. The video consultations are convenient, and the doctors are truly caring. I feel heard and supported every step of the way.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Patient',
    image: '/images/testimonial-2.jpg',
    quote: 'The community support feature has been invaluable. Connecting with other women going through similar experiences helped me feel less alone. Highly recommend GynoCare!',
    rating: 5,
  },
  {
    name: 'Lisa Chen',
    role: 'Patient',
    image: '/images/testimonial-3.jpg',
    quote: 'From booking to consultation, everything was seamless. The health records feature keeps everything organized, and the privacy standards gave me complete peace of mind.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-background to-[#f9a8c9]/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Our Patients Say</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Real stories from women who have trusted GynoCare with their health journey
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white p-6 flex flex-col"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#c94d8a] text-[#c94d8a]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-base leading-relaxed mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
