"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function FAQ() {
  const faqs = [
    {
      question: "What is PeopleFirst?",
      answer:
        "PeopleFirst is a community-driven platform designed to connect individuals in need with those who can help, ensuring support is accessible to everyone during emergencies.",
    },
    {
      question: "Is PeopleFirst free to use?",
      answer:
        "Yes! Our mission is to provide support without barriers, so our platform is completely free for both those offering and seeking help.",
    },
    {
      question: "How can I offer help through PeopleFirst?",
      answer:
        "You can sign up as a volunteer and browse requests for assistance in your area. Once you find someone you can help, you can coordinate directly with them through our platform.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Absolutely! We take privacy seriously and ensure that your data is encrypted and only shared when necessary for assistance purposes.",
    },
    {
      question: "Do I need to have specific skills to volunteer?",
      answer:
        "No, we welcome volunteers with all kinds of skills! Whether you're offering emotional support, delivering supplies, or providing expertise in a specific area, there's always a way you can help others.",
    },
    {
      question:
        "How do I know that the help I'm offering is going to someone in need?",
      answer:
        "Each request on our platform is verified to ensure that help is being directed to those in need. We also have a rating and review system to help ensure trust between community members.",
    },
    {
      question: "Can I offer help to people in other countries?",
      answer:
        "Yes! Our platform is global, and you can offer help to people in need wherever you are. You'll be matched with individuals based on the type of help they require, regardless of location.",
    },
  ]

  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
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
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">FAQs</h2>
        <p className="text-gray-700 text-lg font-medium">
          Find answers to common questions about PeopleFirst.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div 
              className={`border bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                openIndex === index ? "shadow-md" : "hover:shadow-md"
              }`}
            >
              <button
                className="w-full text-left flex justify-between items-center p-5 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-green-600 text-2xl"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-gray-100 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}