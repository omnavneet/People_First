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
    <nav className="py-10">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-green-600 transition-all duration-200"
        >
          <ForestIcon fontSize="medium" />
          <span className="text-gray-700 hover:text-black text-xl font-bold">
            PeopleFirst
          </span>
        </Link>

        <div className="flex space-x-16">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-semibold text-lg text-gray-700 hover:text-black transition-all duration-100"
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
