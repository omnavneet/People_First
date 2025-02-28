import React from "react"
import Footer from "../../components/Footer"

const dashboard = ({ children }) => {
  return (
    <div className="w-full">
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default dashboard
