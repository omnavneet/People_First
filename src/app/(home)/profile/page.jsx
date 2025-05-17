'use client'
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    profilePicture: null,
    createdAt: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch current user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/Users/current');
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // If the API returns data in a nested 'user' property
        const userData = data.user || data;

        // Update user state with the fetched data
        setUser({
          name: userData.name || userData.username || 'User',
          email: userData.email || '',
          profilePicture: userData.profilePicture || userData.avatar || null,
          createdAt: userData.createdAt || userData.created_at || new Date().toISOString()
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || "Failed to load profile data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logging out...");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto animate-spin"
          />
          <p
            className="mt-4 text-gray-600"
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div
          className="text-center text-red-600"
        >
          <p>{error}</p>
          <motion.button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-4 px-2 sm:px-6 md:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto py-6">
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            My Profile
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and account settings
          </p>
        </motion.header>

        <motion.div
          className="bg-white shadow rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Left Column - Profile Picture */}
              <motion.div
                className="md:w-1/3 flex justify-center mb-6 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100 shadow-md">
                    {user.profilePicture ?
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" /> :
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Member since {formatDate(user.createdAt)}
                  </p>
                  <motion.button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/profile/edit')}
                  >
                    Change Photo
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Column - User Info */}
              <motion.div
                className="md:w-2/3 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h2 className="text-sm font-semibold text-gray-500">NAME</h2>
                    </div>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h2 className="text-sm font-semibold text-gray-500">EMAIL</h2>
                    </div>
                    <p className="text-lg">{user.email}</p>
                  </div>

                  <div className="pt-6">
                    <motion.a
                      href="/profile/edit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Account Settings Section */}
          <motion.div
            className="px-6 py-4 bg-gray-50 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Two-factor authentication</h3>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-xs text-red-600 font-medium">Not enabled</span>
                    <motion.button
                      className="text-xs px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Setup
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Password</h3>
                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <motion.button
                    className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Connected accounts</h3>
                    <p className="text-xs text-gray-500">Manage your linked accounts</p>
                  </div>
                  <motion.button
                    className="text-xs px-3 py-1 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Manage
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-500 hover:shadow-md transition-all"
                whileHover={{ y: -3 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Notifications</h3>
                    <p className="text-xs text-gray-500">Manage email preferences</p>
                  </div>
                  <motion.button
                    className="text-xs px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded-lg text-pink-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Configure
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Delete Account section */}
          <div className="p-4 bg-gray-50 text-center border-t border-gray-200">
            <motion.button
              className="text-xs text-red-500 hover:text-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}