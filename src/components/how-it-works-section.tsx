import { UserPlus, Search, CalendarCheck, HeartPulse } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in minutes with your basic information to get started on your healthcare journey.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find a Specialist",
    description: "Browse our network of certified gynecologists and find one that fits your needs.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Book Appointment",
    description: "Choose a convenient time slot and book your consultation online.",
  },
  {
    icon: HeartPulse,
    step: "04",
    title: "Get Care",
    description: "Connect with your doctor via video call and receive personalized care and advice.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-[#fdf2f6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Getting the care you need is simple with our streamlined process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="text-center relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-[#c94d8a]/30" />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-[#f9a8c9] flex items-center justify-center mb-6">
                  <item.icon className="w-10 h-10 text-[#c94d8a]" />
                </div>
                <span className="text-sm font-bold text-[#c94d8a] mb-2">STEP {item.step}</span>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
