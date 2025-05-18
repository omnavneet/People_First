"use client"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Benefits from "../components/Benefits"
import ContactForm from "../components/Contacts"
import FAQ from "../components/FAQ"
import Process from "../components/Process"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-green-100">
      <Navbar />

      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            Together, We Make a <br />
            <span className="text-green-600">Difference That Matters</span>
          </h1>
          <p className="text-black text-base md:text-lg font-medium mt-4 max-w-2xl mx-auto">
            People First is a platform that connects those in need with the
            resources and support they deserve, creating a community of care and
            action.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={"/check_signup"}
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-base px-8 py-3 rounded-lg mt-8 font-semibold shadow-lg transition-all duration-300"
            >
              Get Involved
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section id="benefits" className="py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Benefits />
        </motion.div>
      </section>

      <section id="about" className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            About us
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            At PeopleFirst, we're more than just a platform—we're a community.
            We know how overwhelming it can feel to face a disaster, whether
            it's a natural crisis or a personal emergency. That's why we created
            PeopleFirst: to make sure no one has to go through it alone. Our
            mission is simple—to bring people together, to offer real help, and
            to make support free and accessible for everyone. Because when we
            come together as a community, we're stronger, kinder, and ready to
            face anything. This is about people helping people, and we're here
            for you, every step of the way.
          </p>
        </motion.div>
      </section>

      <section id="process" className="py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Process />
        </motion.div>
      </section>

      <section id="contact" className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <ContactForm />
        </motion.div>
      </section>

      <section id="faq" className="py-20 bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <FAQ />
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
