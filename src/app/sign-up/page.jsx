"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { motion } from "framer-motion"

const SignUp = () => {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [profilePreview, setProfilePreview] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const signUpSchema = z.object({
    userName: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePicture: z.instanceof(File).optional(),
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = signUpSchema.safeParse({
      userName,
      email,
      password,
      profilePicture,
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
    if (profilePicture) {
      formData.append("profilePicture", profilePicture)
    }

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Us</h1>
          <p className="text-lg text-gray-600">
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
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {profilePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-200"
                >
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none cursor-pointer"
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
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
          transition={{ delay: 0.8 }}
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

        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="p-3 bg-gray-50 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.98 }}
            >
              Visit Homepage
            </motion.button>
            <motion.button
              className="p-3 bg-purple-50 rounded-xl text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05, backgroundColor: "#f3e8ff" }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUp
