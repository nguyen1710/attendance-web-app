// Dialog.js
import React, { useState } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
// eslint-disable-next-line react/prop-types
function CreateAttendance({ isOpen, onClose, classroomId, method }) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  console.log("id class:",classroomId)
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  if (!isOpen) return null;
  const handleCreate = async () => {
    try {
      // Gọi API để xử lý email
      const response = await axios.post(
        `${API_URL_BASE}/attendance-service/api/attendances/createAttandence`, // Địa chỉ API của bạn
        { classroomId, name, desc, method }, // Gửi email trong body của yêu cầu
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
          },
        }
      );

      if (response.data.success) {
        toast.success('Create new attendences successfully');
       
        setName(""); // Reset dữ liệu form
        setDesc("");
        // onClose(); // Đóng dialog
        window.location.reload(); // Làm mới toàn bộ trang
      }
    } catch (error) {
      console.error('Error adding attend:', error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Create New {method} Attendance</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Enter name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="desc"
          id="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          placeholder="Enter description"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 bg-gray-200 hover:bg-warning focus:ring-4 focus:ring-gray-300  hover:text-white font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  );
}

export default CreateAttendance;
