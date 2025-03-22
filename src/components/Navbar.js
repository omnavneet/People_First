import React, { useState, useEffect } from "react"
import ForestIcon from "@mui/icons-material/Forest"
import Link from "next/link"
import { motion } from "framer-motion"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "benefits",
        "about",
        "process",
        "contact",
        "faq",
      ]

      // Check if scrolled for navbar background
      setScrolled(window.scrollY > 50)

      // Find active section
      let currentSection = "home"
      let minDistance = Infinity

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const distance = Math.abs(rect.top)
          if (distance < minDistance) {
            minDistance = distance
            currentSection = section
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "benefits", label: "Benefits" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "contact", label: "Contact" },
    { id: "faq", label: "FAQ" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full flex items-center justify-between p-4 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-600 text-white rounded-full p-2 shadow-md"
          >
            <ForestIcon />
          </motion.div>
        </Link>
      </div>

      <nav className="hidden md:flex justify-center space-x-6 text-black font-medium text-sm px-6 py-2 rounded-full items-center ml-20">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`relative px-2 py-1 transition-all duration-200 ${
              activeSection === link.id
                ? "text-green-600 font-semibold"
                : "hover:text-green-600"
            }`}
          >
            {link.label}
            {activeSection === link.id && (
              <motion.div
                layoutId="navIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </a>
        ))}
      </nav>

      <div className="flex space-x-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={"/check_signin"}
            className="bg-white hover:bg-gray-100 text-green-600 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md border border-gray-100"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Navbar
