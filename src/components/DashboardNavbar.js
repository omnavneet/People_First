import React from "react"
import ForestIcon from "@mui/icons-material/Forest"
import Profile from "./Profile"
import Link from "next/link"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Requests", href: "/requests" },
  { name: "Events", href: "/events" },
]

const DashboardNavbar = () => {
  return (
    <nav className="bg-black py-5 shadow-2xl">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-green-600 transition-all duration-200"
        >
          <ForestIcon fontSize="small" />
          <span className="text-gray-300 hover:text-white text-lg font-semibold">
            PeopleFirst
          </span>
        </Link>

        <div className="flex space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-gray-400 uppercase font-semibold text-md hover:text-white transition-all duration-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Profile />
      </div>
    </nav>
  )
}

export default DashboardNavbar
