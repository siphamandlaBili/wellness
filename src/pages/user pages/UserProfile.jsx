import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../../../context/authContext";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

axios.defaults.withCredentials = true;

const Backend= import.meta.env.VITE_BACKEND_URL;

const EditProfileModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        image: null
      });
      setImagePreview(user.image);
    }
  }, [isOpen, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#615e5e80] dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">✕</button>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={imagePreview || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#992787] dark:border-purple-400"
              />
              <label className="absolute bottom-0 right-0 bg-[#992787] dark:bg-purple-600 p-2 rounded-full cursor-pointer transition hover:bg-[#7a1f6e] dark:hover:bg-purple-700">
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#992787] dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-[#992787] dark:bg-purple-600 text-white rounded-lg hover:bg-[#7a1f6e] dark:hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3c3b3b7b] dark:bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md transform transition-all">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg 
              className="h-6 w-6 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Account</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This will permanently remove all your data and cannot be undone. Are you sure you want to continue?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useContext(UserContext);

  const handleSaveProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', updatedData.name);
      formData.append('email', updatedData.email);
      formData.append('phone', updatedData.phone);
      formData.append('bio', updatedData.bio);
      if (updatedData.image instanceof File) {
        formData.append('image', updatedData.image);
      }

      const response = await axios.put(
        `${Backend}/api/v1/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      login(response?.data?.user);
      toast.success('Profile updated successfully!');
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900">
      <ToastContainer/>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-[#992787] to-[#6a1b5e]">
          <div className="absolute -bottom-16 left-8">
            <img
              src={user?.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user?.fullName}</h1>
              <p className="text-[#992787] dark:text-purple-400 font-medium mt-1 capitalize">{user?.role}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl">
                {user?.bio || "No bio provided"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#992787] dark:text-purple-400 hover:bg-[#f9f4f9] dark:hover:bg-gray-700 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Events Completed</h3>
          <p className="text-4xl font-bold text-[#992787] dark:text-purple-400 mt-2">
            {user?.eventsCompleted || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Profile Strength</h3>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-[#992787] dark:bg-purple-600 h-2.5 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
            <p className="text-right mt-1 text-sm text-gray-600 dark:text-gray-400">
              85% Complete
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#992787] dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#992787] dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{user?.phone || 'No phone number provided'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Security & Preferences</h2>
        <div className="space-y-4">
          {['Two-Factor Authentication', 'Change Password'].map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">{item}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {index === 0 ? 'Add an extra layer of security to your account' : 'Last changed 3 months ago'}
                </p>
              </div>
              <button className="px-4 py-2 text-[#992787] dark:text-purple-400 hover:bg-[#f9f4f9] dark:hover:bg-gray-600 rounded-lg transition">
                {index === 0 ? 'Enable' : 'Update'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
        isLoading={isLoading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default UserProfilePage;