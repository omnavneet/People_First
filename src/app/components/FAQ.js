"use client"
import { useState } from "react"

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
    <section id="faq" className="max-w-lg mx-auto py-20 px-5">
      <h2 className="text-5xl font-bold text-black">FAQs</h2>
      <p className="text-black text-[16px] font-semibold mt-3">
        Find answers to common questions about PeopleFirst.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border bg-white px-4 py-2 shadow-sm shadow-pink-100 transition-all rounded-2xl"
          >
            <button
              className="w-full text-left flex justify-between items-center font-semibold text-black text-lg focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-left">{faq.question}</span>{" "}
              <span className="text-xl text-black ">{openIndex === index ? "−" : "+"}</span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-screen" : "max-h-0"
              }`}
            >
              <p className="mt-2 text-black">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
