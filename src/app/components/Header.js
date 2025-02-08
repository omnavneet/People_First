import React from "react"
import ForestIcon from "@mui/icons-material/Forest"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 z-50 pr-16">
      <div className="w-64"></div>

      <nav className="flex justify-center space-x-5 text-black font-semibold text-[11px] bg-white py-1 pr-4 pl-1 rounded-full items-center">
        <a
          href="/"
          className="bg-black text-white hover:text-green-600 rounded-full p-1 transition-all duration-200"
        >
          <ForestIcon fontSize="small" />
        </a>

        <a
          href="#home"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          Home
        </a>
        <a
          href="#benefits"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          Benefits
        </a>
        <a
          href="#about"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          About
        </a>
        <a
          href="#process"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          Process
        </a>
        <a
          href="#contact"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          Contact
        </a>
        <a
          href="#faq"
          className="hover:border-b-[2px] border-black pb-[2px] transition-all duration-100"
        >
          FAQ
        </a>
      </nav>

      <div className="flex space-x-2">
        <button className="bg-white text-black px-4 py-2 rounded-3xl text-[11px] font-semibold transition">
          Sign In
        </button>
        <button className="bg-white text-black px-4 py-2 rounded-3xl text-[11px] font-semibold transition">
          Sign Up
        </button>
      </div>
    </header>
  )
}

export default Header
