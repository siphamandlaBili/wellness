import React from 'react';

const ManageAdmins = () => {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <button className="bg-[#992787] text-white p-2 rounded-md mb-4">Add New Admin</button>
      {/* List of Admins */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p>Admin Name</p>
          <div>
            <button className="bg-[#992787] text-white p-1 rounded-md">Edit</button>
            <button className="bg-red-500 text-white p-1 rounded-md ml-2">Remove</button>
          </div>
        </div>
        {/* Add more admin entries */}
      </div>
    </div>
  );
};

export default ManageAdmins;
