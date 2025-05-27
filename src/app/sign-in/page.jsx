"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { motion } from "framer-motion"

const SignIn = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const signInSchema = z.object({
    userName: z.string().min(3, "User Name must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = signInSchema.safeParse({
      userName,
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
    formData.append("password", password)

    try {
      const res = await fetch("/api/auth/signin", {
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
      setError(error.message || "Failed to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  const goToSignUp = () => {
    router.push("/sign-up")
  }

  return (
    <div className="flex flex-col py-4 px-2 sm:px-6 md:px-4 lg:px-8 bg-green-50 min-h-screen items-center justify-center">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-lg text-gray-600">
            Sign in to continue making a difference in your community
          </p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Enter your username"
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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
                  Signing In...
                </div>
              ) : (
                "Sign In"
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
          className="mt-8 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={goToSignUp}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Create account
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignIn
