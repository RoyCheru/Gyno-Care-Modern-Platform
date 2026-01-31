"use client";

import React from "react";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage("Thank you! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#f9a8c9] to-white py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Have questions about our services? We'd love to hear from you.
              Contact us and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Email */}
              <div className="bg-white rounded-lg border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#fdf2f7] p-4 rounded-full">
                    <Mail className="w-8 h-8 text-[#c94d8a]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Send us an email anytime</p>
                <a
                  href="mailto:support@gynocare.com"
                  className="text-[#c94d8a] font-semibold hover:underline"
                >
                  support@gynocare.com
                </a>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-lg border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#fdf2f7] p-4 rounded-full">
                    <Phone className="w-8 h-8 text-[#c94d8a]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 mb-4">
                  Call us for immediate assistance
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-[#c94d8a] font-semibold hover:underline"
                >
                  +1 (234) 567-890
                </a>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="bg-[#fdf2f7] p-4 rounded-full">
                    <MapPin className="w-8 h-8 text-[#c94d8a]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Address
                </h3>
                <p className="text-gray-600 mb-4">Visit our office</p>
                <p className="text-[#c94d8a] font-semibold">
                  123 Healthcare St,
                  <br />
                  Medical City, MC 12345
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[#fdf2f7] rounded-lg border border-[#f9a8c9] p-8 mb-16">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#c94d8a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Business Hours
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 font-medium mb-2">
                        Monday - Friday
                      </p>
                      <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">
                        Saturday - Sunday
                      </p>
                      <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Send us a Message
            </h2>
            <p className="text-gray-600 text-center mb-12">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm"
            >
              {submitMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {submitMessage}
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c94d8a] focus:ring-2 focus:ring-[#f9a8c9] transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c94d8a] focus:ring-2 focus:ring-[#f9a8c9] transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c94d8a] focus:ring-2 focus:ring-[#f9a8c9] transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c94d8a] focus:ring-2 focus:ring-[#f9a8c9] transition-all resize-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c94d8a] hover:bg-[#b03d78] text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "How quickly will I receive a response?",
                  a: "We aim to respond to all inquiries within 24 hours during business days.",
                },
                {
                  q: "Can I schedule a consultation through this form?",
                  a: 'For scheduling consultations, please use our "Book Consultation" feature in the main application.',
                },
                {
                  q: "Is my information secure?",
                  a: "Yes, all information submitted through this form is encrypted and handled securely according to our privacy policy.",
                },
                {
                  q: "What if I need urgent assistance?",
                  a: "For urgent matters, please call our phone number directly during business hours for immediate assistance.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                    {faq.q}
                    <span className="transform group-open:rotate-180 transition-transform text-[#c94d8a]">
                      ▼
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
