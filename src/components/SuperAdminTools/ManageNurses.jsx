import React, { useState } from 'react';

const ManageNurses = () => {
  const [nurses, setNurses] = useState([
    { id: 1, name: 'Nurse 1', department: 'Pediatrics' },
    { id: 2, name: 'Nurse 2', department: 'Emergency' },
  ]);

  const handleDelete = (id) => {
    setNurses(nurses.filter((nurse) => nurse.id !== id));
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Manage Nurses</h2>
      <ul className="space-y-2">
        {nurses.map((nurse) => (
          <li key={nurse.id} className="flex justify-between items-center border-b pb-2">
            <span>{nurse.name} ({nurse.department})</span>
            <button
              onClick={() => handleDelete(nurse.id)}
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

export default ManageNurses;
