"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("")
    setIsSending(true)

    try {
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
    } catch (error) {
      setStatus("An error occurred. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="py-16 w-full max-w-6xl mx-auto px-4">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">Contact Us</h2>
        <p className="text-gray-700 text-lg font-medium">
          Have questions or need assistance? Reach out to us.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <motion.form
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isSending}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </motion.form>

          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg text-center transition-all ${
                status.includes("successfully")
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-red-700 bg-red-50 border border-red-200"
              }`}
            >
              {status}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}