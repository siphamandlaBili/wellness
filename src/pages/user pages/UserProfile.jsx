import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user.clientName,
    email: user.clientEmail,
    phone: user.clientPhone,
    image: user.image || "https://via.placeholder.com/150",
  });
  const [imagePreview, setImagePreview] = useState(formData.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#615e5e80] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-5">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#992787]"
              />
              <label className="absolute bottom-0 right-0 bg-[#992787] p-2 rounded-full cursor-pointer transition hover:bg-[#7a1f6e]">
                <input type="file" onChange={handleImageChange} className="hidden" />
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#992787] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#992787] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#992787] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#992787] text-white rounded-lg hover:bg-[#7a1f6e] transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: user.clientName,
    email: user.clientEmail,
    phone: user.clientPhone,
    role: user.role,
    joined: "January 15, 2023",
    image: "https://thumb.ac-illust.com/11/117f0a7d2b5c41239ad2456baf5c3eac_t.jpeg",
    bio: "Digital transformation enthusiast with a passion for creating seamless user experiences.",
    social: {
      twitter: "@userhandle",
      linkedin: "linkedin.com/in/userprofile"
    },
    stats: {
      projects: 42,
      connections: 289,
      completion: 85
    }
  });

  const handleSaveProfile = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  };
// Add this component above UserProfilePage
const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3c3b3b7b] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md transform transition-all">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg 
              className="h-6 w-6 text-red-600" 
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Account</h3>
          <p className="text-gray-500 mb-6">
            This will permanently remove all your data and cannot be undone. Are you sure you want to continue?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// UserProfilePage component follows below...
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-[#992787] to-[#6a1b5e]">
          <div className="absolute -bottom-16 left-8">
            <img
              src={profile.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
              <p className="text-[#992787] font-medium mt-1">{profile.role}</p>
              <p className="text-gray-600 mt-3 max-w-2xl">{profile.bio}</p>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#992787] hover:bg-[#f9f4f9] rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">Events Completed</h3>
          <p className="text-4xl font-bold text-[#992787] mt-2">{profile.stats.projects}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">Employess</h3>
          <p className="text-4xl font-bold text-[#992787] mt-2">{profile.stats.connections}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700">Profile Strength</h3>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#992787] h-2.5 rounded-full"
                style={{ width: `${profile.stats.completion}%` }}
              />
            </div>
            <p className="text-right mt-1 text-sm text-gray-600">{profile.stats.completion}% Complete</p>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#992787]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#992787]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-600">{profile.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Connections</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              <span className="text-gray-600">{profile.social.twitter}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
              <span className="text-gray-600">{profile.social.linkedin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Security & Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition">
            <div>
              <h3 className="font-medium text-gray-700">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 text-[#992787] hover:bg-[#f9f4f9] rounded-lg transition">
              Enable
            </button>
          </div>
          <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition">
            <div>
              <h3 className="font-medium text-gray-700">Change Password</h3>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <button className="px-4 py-2 text-[#992787] hover:bg-[#f9f4f9] rounded-lg transition">
              Update
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => {
          console.log("Account deleted");
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default UserProfilePage;