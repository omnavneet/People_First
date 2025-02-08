import { Manrope } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
