// Dialog.js
import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import socket from "~/socketio/socket.js"
function CreateSubmissionDialog({ isOpen, onClose, classId, refreshData }) {
//   const [name, setName] = useState("")
//   const [desc, setDesc] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [evidence, setEvidence ] = useState("")
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [error, setError] = useState("");
    const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

    //   console.log("id class:",submissionId)
    if (!isOpen) return null;
  const handleCreate = async () => {
    try {
      // Gọi API để xử lý email
      const response = await axios.post(
        `${API_URL_BASE}/attendance-service/api/submissions/createSubmission/${classId}`, // Địa chỉ API của bạn
        { title, content, evidence, fromDate, toDate }, // Gửi email trong body của yêu cầu
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
          },
        }
      );

      if (response.data.success) {
        toast.success('Create new attendences successfully');
       
        setTitle(""); // Reset dữ liệu form
        setContent("")
        setError(""); // Reset dữ liệu form
        setFromDate("")
        setToDate(""); // Reset dữ liệu form
        setEvidence("")
        // onClose(); // Đóng dialog
        // window.location.reload(); // Làm mới toàn bộ trang
        refreshData()
        socket.emit("notification", {notification: response?.data.notification})

        onClose
      }
    } catch (error) {
      console.error('Error adding attend:', error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 w-[50%]">
        <h2 className="text-lg font-semibold mb-4">Create New Submission</h2>
        
        {/* Title Field */}
        <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter title"
            />
        </div>
        
        {/* Content Field */}
        <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
                type="text"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter content"
                rows="10"
            />
        </div>

        
        <div className="mb-4 flex gap-4">
            {/* From Date Field */}
            <div className="flex-1">
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From</label>
                <input
                    type="date"
                    id="fromDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
            </div>
            
            {/* To Date Field */}
            <div className="flex-1">
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To</label>
                <input
                    type="date"
                    id="toDate"
                    min={fromDate || new Date().toISOString().split("T")[0]} // Ngày bắt đầu phải >= ngày "fromDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
            </div>
        </div>

        {/* Upload Evidence Field */}
        <div className="mb-4">
            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">Upload Evidence</label>
            <input
                type="file"
                id="evidence"
                accept="image/*"
                onChange={(e) => setEvidence(e.target.files[0])}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
        </div>
        
        {/* Action Buttons */}
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
                className="text-gray-500 bg-gray-200 hover:bg-warning focus:ring-4 focus:ring-gray-300 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5"
            >
                Cancel
            </button>
        </div>
    </div>
</div>

  );
}

export default CreateSubmissionDialog;
