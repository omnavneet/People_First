import React from "react"
import DashboardNavbar from "@/components/DashboardNavbar"

const Dashboard = ({ children }) => {
  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col">
      <div className="flex">

        {/* Sidebar */}
        <div className="w-1/6">
          <DashboardNavbar />
        </div>

        {/* Main content */}
        <div className="py-4 px-1 w-5/6">{children}</div>
      </div>
    </div>
  )
}

export default Dashboard
