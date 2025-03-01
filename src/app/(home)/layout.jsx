import React from "react"
import Footer from "../../components/Footer"
import DashboardNavbar from "@/components/DashboardNavbar"

const dashboard = ({ children }) => {

  return (
    <div className="w-full h-screen bg-black text-white">
      <DashboardNavbar />
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default dashboard
