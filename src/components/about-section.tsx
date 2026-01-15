import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Column */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/female-doctor-consulting-patient-in-modern-clinic-.jpg"
                alt="Doctor consulting with a patient"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
            </div>
          </div>

          {/* Text Column */}
          <div className="flex-1 w-full">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6 text-balance">About GynoCare</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                GynoCare is a dedicated online platform designed to support women's health by connecting patients with
                trusted, experienced gynecologists. We understand that accessing quality healthcare should be simple,
                private, and convenient.
              </p>
              <p>
                Our mission is to simplify appointment booking and provide a seamless consultation experience, whether
                you need routine check-ups, specialized care, or expert advice. With GynoCare, compassionate
                gynaecological support is just a few clicks away.
              </p>
              <p>
                We partner with certified professionals who are committed to delivering personalized care tailored to
                your unique needs, ensuring you feel heard, respected, and empowered throughout your healthcare journey.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Trusted Doctors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50k+</p>
                <p className="text-sm text-muted-foreground">Happy Patients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
