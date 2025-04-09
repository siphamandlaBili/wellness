import React, { useState } from 'react';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin 1', email: 'admin1@example.com' },
    { id: 2, name: 'Admin 2', email: 'admin2@example.com' },
  ]);

  const handleDelete = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <ul className="space-y-2">
        {admins.map((admin) => (
          <li key={admin.id} className="flex justify-between items-center border-b pb-2">
            <span>{admin.name} ({admin.email})</span>
            <button
              onClick={() => handleDelete(admin.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAdmins;
