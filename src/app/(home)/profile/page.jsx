'use client'
import { useState, useEffect, useRef } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch current user data from API
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/Users/current');
        const data = await response.json();
        console.log(data);

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

        // Also initialize edit data
        setEditData({
          name: userData.name || userData.username || 'User',
          email: userData.email || ''
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

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      name: user.name,
      email: user.email
    });
    setPreviewUrl(user.profilePicture);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSaveError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('email', editData.email);

      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      // Send the update request to the API
      const response = await fetch('/api/Users/update', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update the local user state with the new data
      setUser({
        ...user,
        name: editData.name,
        email: editData.email,
        profilePicture: selectedFile ? previewUrl : user.profilePicture
      });

      setIsEditing(false);
      setSelectedFile(null);
      setIsSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError(err.message || 'Failed to save changes');
      setIsSaving(false);
    }
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
            {isEditing ? 'Edit your profile information' : 'Manage your personal information and account settings'}
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
                  <div
                    className={`w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 ${isEditing ? 'border-blue-200' : 'border-gray-100'} shadow-md relative`}
                  >
                    {isEditing ? (
                      previewUrl ? (
                        <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        user.profilePicture ? (
                          <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )
                      )
                    ) : (
                      user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )
                    )}

                    {isEditing && (
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <div className="text-white text-center p-2">
                          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-xs mt-1">Change Photo</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <p className="mt-4 text-sm text-gray-500">
                    Member since {formatDate(user.createdAt)}
                  </p>

                  {!isEditing && (
                    <motion.button
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Right Column - User Info */}
              <motion.div
                className="md:w-2/3 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isEditing ? (
                  <div className="space-y-6">
                    {saveError && (
                      <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500 mb-4">
                        <p className="text-red-700 text-sm">{saveError}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-sm font-semibold text-gray-500">NAME</h2>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-sm font-semibold text-gray-500">EMAIL</h2>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <motion.button
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : "Save Changes"}
                      </motion.button>

                      <motion.button
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
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
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Account Settings Section - Only shown when not editing */}
          {!isEditing && (
            <>
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
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}