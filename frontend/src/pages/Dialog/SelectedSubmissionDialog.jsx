/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
function SelectedSubmissionDialog({
    isOpen,
    onClose,
    submissionId,
    title,
    content,
    fromDate,
    toDate,
    evidence,
    refreshData
}) {
    const [newTitle, setNewTitle] = useState(title || "");
    const [newContent, setNewContent] = useState(content || "");
    const [newEvidence, setNewEvidence] = useState(evidence || "");
    const [newFromDate, setNewFromDate] = useState(fromDate || "");
    const [newToDate, setNewToDate] = useState(toDate || "");

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    useEffect(() => {
      if (fromDate) {
          setNewFromDate(formatDate(fromDate));
      }
      if (toDate) {
          setNewToDate(formatDate(toDate));
      }
  }, [fromDate, toDate]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // Handle the form submission here
        console.log('Submitted:', newTitle, newContent, newFromDate, newToDate, newEvidence, submissionId);
        try {
          // Gọi API để xử lý email
          const response = await axios.post(
            `http://localhost:4000/attandence-service/api/submissions/updateSubmission/`, // Địa chỉ API của bạn
            { newTitle, newContent, newFromDate, newToDate, newEvidence, submissionId}, // Gửi email trong body của yêu cầu
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
              },
            }
          );
    
          if (response.data.success) {
            toast.success('Update new attendences successfully');
            // setNewTitle(""); // ResetNew dữ liệu form
            // setNewContent("");
            // setNewFromDate("");
            // setNewToDate(""); // ResetNew dữ liệu form
            // setNewEvidence("");
            // onClose(); // Đóng dialog
            // window.location.reload(); // Làm mới toàn bộ trang
            refreshData();
            onClose
          }
        } catch (error) {
          console.error('Error adding attend:', error);
          toast.error(error.response.data.message);
        }
      };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 ">
                <h2 className="text-lg font-semibold mb-4">Update Submission</h2>
                {/* Title Field */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Enter title"
                    />
                </div>

                {/* Content Field */}
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        placeholder="Enter content"
                        rows="10"
                    />
                </div>

                {/* Date Fields */}
                <div className="mb-4 flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From</label>
                        <input
                            type="date"
                            id="fromDate"
                            value={newFromDate}
                            onChange={(e) => setNewFromDate(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To</label>
                        <input
                            type="date"
                            id="toDate"
                            value={newToDate}
                            onChange={(e) => setNewToDate(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Upload Evidence */}
                <div className="mb-4">
                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">Upload Evidence</label>
                    <input
                        type="file"
                        id="evidence"
                        accept="image/*"
                        onChange={(e) => setNewEvidence(e.target.files[0])}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SelectedSubmissionDialog;
