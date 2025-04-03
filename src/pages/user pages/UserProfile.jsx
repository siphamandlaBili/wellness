import React, { useState,useContext } from 'react';
import { AuthContext } from '../../../context/authContext';
// Edit Profile Modal
const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  const {user} = useContext(AuthContext);

  const [name, setName] = useState(user.clientName);
  const [email, setEmail] = useState(user.clientEmail);
  const [phone, setPhone] = useState(user.clientPhone);
  const [image, setImage] = useState(
    "https://media.istockphoto.com/id/1372065700/photo/portrait-of-a-confident-young-businessman-working-in-a-modern-office.jpg?s=612x612&w=0&k=20&c=oPRp9aiGEb_00Y0Q_eR40MiOisM2eFfeP7lDf0IqJDw="
  );
  const [imagePreview, setImagePreview] = useState(image);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImage(reader.result); // Save the image URL to state
      };
      reader.readAsDataURL(file); // Convert image to base64 string
    }
  };

  const handleSubmit = () => {
    onSave({ name, email, phone, image });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgb(14,32,56,0.28)] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-gray-600">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-gray-600">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-gray-600">Profile Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-[#992787] text-white rounded-md hover:bg-[#7a1f6e]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgb(14,32,56,0.28)] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Are you sure?</h2>
        <p className="text-gray-600 mb-4">This action cannot be undone. Do you want to delete your account?</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin Profile Page
const UserProfilePage = ({name}) => {
  const {user} = useContext(AuthContext);
  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    name: user.clientName,
    email: user.clientEmail,
    role: user.role,
    phone: user.clientPhone,
    joined: "January 15, 2023",
    image: "https://media.istockphoto.com/id/1372065700/photo/portrait-of-a-confident-young-businessman-working-in-a-modern-office.jpg?s=612x612&w=0&k=20&c=oPRp9aiGEb_00Y0Q_eR40MiOisM2eFfeP7lDf0IqJDw="
  });

  const handleEditProfile = (updatedInfo) => {
    setAdminInfo((prev) => ({
      ...prev,
      name: updatedInfo.name,
      email: updatedInfo.email,
      phone: updatedInfo.phone,
      image: updatedInfo.image,
    }));
  };

  const handleDeleteAccount = () => {
    // Logic to delete the admin account (e.g., making an API call)
    console.log("Account deleted!");
    setDeleteModalOpen(false);
  };
  

  
  return (
    <>
      <div className="flex items-center mb-6">
        <img
          src={adminInfo.image}
          alt="Admin Profile"
          className="w-24 h-24 rounded-full border-4 border-[#992787] mr-6"
        />
        <div>
          <h1 className="text-3xl font-semibold text-[#992787]">{user.clientName}</h1>
          <p className="text-gray-600 text-lg">{user.role}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Admin Info Section */}
        <div className="bg-[#f9f4f9] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#992787] mb-4">Company Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold text-gray-800">{user.clientEmail}</p>
            </div>
            <div>
              <p className="text-gray-600">Role:</p>
              <p className="font-semibold text-gray-800">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-semibold text-gray-800">{user.clientPhone}</p>
            </div>
            <div>
              <p className="text-gray-600">Joined:</p>
              <p className="font-semibold text-gray-800">{adminInfo.joined}</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-[#f9f4f9] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#992787] mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => setEditModalOpen(true)}
              className="py-2 px-4 bg-[#992787] text-white rounded-lg font-medium hover:bg-[#7a1f6e] transition duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditProfile}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteAccount}
      />
    </>
  );
};

export default UserProfilePage;
