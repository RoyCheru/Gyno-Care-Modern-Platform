import { Video, MessageCircle, Calendar, FileText, Users, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Video,
    title: "Video Consultations",
    description: "Connect with certified gynecologists from the comfort of your home through secure video calls.",
  },
  {
    icon: MessageCircle,
    title: "Chat Support",
    description: "Get quick answers to your health questions through our 24/7 chat support system.",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book appointments at your convenience with our simple and flexible scheduling system.",
  },
  {
    icon: FileText,
    title: "Health Records",
    description: "Access and manage your medical records securely in one centralized location.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a supportive community of women sharing experiences and advice.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Guaranteed",
    description: "Your health information is protected with enterprise-grade security and encryption.",
  },
]

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Services
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive gynaecological care designed to support every aspect
            of your health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-shadow bg-card"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#f9a8c9]/30 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-[#c94d8a]" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
