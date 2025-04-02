import React from 'react';

const ManageNurses = () => {
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Manage Nurses</h2>
      <button className="bg-[#992787] text-white p-2 rounded-md mb-4">Add New Nurse</button>
      {/* List of Nurses */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p>Nurse Name</p>
          <div>
            <button className="bg-[#992787] text-white p-1 rounded-md">Edit</button>
            <button className="bg-red-500 text-white p-1 rounded-md ml-2">Remove</button>
          </div>
        </div>
        {/* Add more nurse entries */}
      </div>
    </div>
  );
};

export default ManageNurses;
