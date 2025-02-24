"use client"
import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("Sending...")

    const response = await fetch("https://formspree.io/f/xrbelrkp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setStatus("Message sent successfully!")
      setFormData({ name: "", email: "", message: "" })
    } else {
      setStatus("Failed to send message. Try again.")
    }
  }

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
    >
      <div className="py-20">
        <h2 className="text-5xl font-bold text-black">Contact Us</h2>
        <p className="text-black text-[16px] font-semibold mt-3">
          Have questions or need assistance? Reach out to us through the form
          below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-md mx-auto space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-lg font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 max-w-sm mx-auto ${
              status.includes("successfully")
                ? "text-green-700 bg-green-100 border border-green-500"
                : "text-red-700 bg-red-100 border border-red-500"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  )
}
