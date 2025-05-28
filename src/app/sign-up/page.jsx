"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import ForestIcon from "@mui/icons-material/Forest"

const SignUp = () => {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const signUpSchema = z.object({
    userName: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = signUpSchema.safeParse({
      userName,
      email,
      password,
    })

    if (!result.success) {
      const firstError = result.error.issues[0].message
      setError(firstError)
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("userName", userName)
    formData.append("email", email)
    formData.append("password", password)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorMessage = await res.text()
        throw new Error(errorMessage || "Something went wrong!")
      }

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      setError(error.message || "Failed to create account. Please try again.")
      setIsLoading(false)
    }
  }

  const goToSignIn = () => {
    router.push("/sign-in")
  }

  return (
    <div className="flex flex-col py-4 px-2 sm:px-6 md:px-4 lg:px-8 bg-green-700/10 min-h-screen items-center justify-center">
      <div className="absolute top-10 left-16">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-full bg-green-50 text-green-600 transition-all duration-200">
            <ForestIcon fontSize="medium" />
          </div>
          <span className="text-green-600 text-4xl font-bold transition-all duration-200">
            PeopleFirst
          </span>
        </Link>
      </div>

      <motion.div
        className="w-full max-w-lg bg-white rounded-xl shadow-md p-10 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-black mb-4">Sign Up</h1>
          <p className="text-lg text-gray-800">
            Create an account to start making an impact
          </p>
        </motion.div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Choose a username"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Create a secure password"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <motion.button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </form>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <motion.button
              onClick={goToSignIn}
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUp
