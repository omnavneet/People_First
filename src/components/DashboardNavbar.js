"use client"
import React from "react"
import ForestIcon from "@mui/icons-material/Forest"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SmartToyIcon from "@mui/icons-material/SmartToy"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Requests", href: "/requests" },
  { name: "Events", href: "/events" },
  { name: "Alert Center", href: "/alert-center" },
  { name: "Support & Info", href: "/support-info" },
]

const handleLogout = () => {
  const response = fetch("/api/auth/logout", {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        redirect("/sign-in")
      } else {
        console.error("Logout failed")
      }
    })
    .catch((error) => {
      console.log("Error during logout:", error)
    })
}

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="h-screen w-64 mr-2 fixed left-0 top-0 bg-green-100 shadow-md flex flex-col">
      {/* Logo section */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-all duration-200">
            <ForestIcon fontSize="medium" />
          </div>
          <span className="text-gray-800 group-hover:text-green-600 text-xl font-bold transition-all duration-200">
            PeopleFirst
          </span>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 py-6">
        <div className="flex flex-col space-y-2 px-4">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={`relative font-medium text-base py-3 px-4 rounded-lg ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-black hover:bg-green-200"
                } transition-all duration-200`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Profile and Logout section */}
      <div className="p-4 border-t mt-auto space-y-3">
        <Link
          href="/profile"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-200 transition-all duration-200"
        >
          <div className="bg-green-100 p-2 rounded-full">
            <AccountCircleIcon fontSize="small" className="text-green-600" />
          </div>
          <span className="font-medium text-gray-800">Profile</span>
        </Link>

        <motion.button
          className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-200 text-red-600 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
        >
          <ExitToAppIcon fontSize="small" className="ml-2" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  )
}

export default Sidebar
