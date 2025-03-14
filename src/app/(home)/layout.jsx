import React from "react"
import Footer from "../../components/Footer"
import DashboardNavbar from "@/components/DashboardNavbar"

const dashboard = ({ children }) => {
  return (
    <div className="bg-[#fbfbfe] bg-cover bg-center flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex-grow ">{children}</div>
      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </div>
  )
}

export default dashboard
