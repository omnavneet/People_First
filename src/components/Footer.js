"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import GitHubIcon from "@mui/icons-material/GitHub"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import ForestIcon from "@mui/icons-material/Forest"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <ForestIcon style={{ color: "#22c55e", fontSize: 28 }} className="mr-2" />
              <span className="text-xl font-bold text-gray-800">PeopleFirst</span>
            </motion.div>
            <p className="text-gray-600 mb-6">
              Connecting people in need with real-time support from the
              community, making a difference that matters every day.
            </p>
            <div className="flex space-x-3">
              <motion.a 
                href="https://github.com/omnavneet"
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm text-gray-700 hover:text-green-600 transition-colors"
                whileHover={{ y: -3 }}
              >
                <GitHubIcon fontSize="small" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com/in/omnavneet"
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm text-gray-700 hover:text-blue-600 transition-colors"
                whileHover={{ y: -3 }}
              >
                <LinkedInIcon fontSize="small" />
              </motion.a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-600 hover:text-green-600 transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#process" className="text-gray-600 hover:text-green-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 hover:text-green-600 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4">Contact Us</h3>
              <li className="flex items-center text-gray-600">
                <EmailIcon fontSize="small" className="mr-2 text-green-600" />
                <a href="mailto:contactnavneet7@gmail.com" className="hover:text-green-600 transition-colors">
                  contactnavneet7@gmail.com
                </a>
              </li>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {currentYear} PeopleFirst. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer