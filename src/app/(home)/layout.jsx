import React from "react"
import Footer from "../../components/Footer"
import DashboardNavbar from "@/components/DashboardNavbar"

const dashboard = ({ children }) => {
  return (
    <div className="min-h-screen bg-[url('/wave.png')] bg-cover bg-center">
      <DashboardNavbar />
      <div>{children}</div>
      <div className="fixed bottom-0 w-full">
        <Footer />
      </div>
    </div>
  )
}

export default dashboard
