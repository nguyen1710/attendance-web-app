import React, { useState, useEffect } from 'react';

const EditModal = ({ client, isOpen, onClose, onCancel, onSave }) => {
  // Format the client date to just the date part (YYYY-MM-DD)
  const formattedDate = client.date ? new Date(client.date).toISOString().split('T')[0] : '';

  const [name, setName] = useState(client.name);
  const [date, setDate] = useState(formattedDate); // Set the formatted date

  const handleSave = () => {
    onSave({ ...client, name, date });
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Client</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700">Date</label>
          <input
            id="date"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
