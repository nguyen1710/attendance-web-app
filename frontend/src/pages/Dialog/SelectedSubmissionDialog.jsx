/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import socket from "~/socketio/socket";

function SelectedSubmissionDialog({
    isOpen,
    onClose,
    submissionId,
    title,
    content,
    fromDate,
    toDate,
    evidence,
    status,
    classOwner,
    refreshData
}) {
    const [newTitle, setNewTitle] = useState(title || "");
    const [newContent, setNewContent] = useState(content || "");
    const [newEvidence, setNewEvidence] = useState(evidence || "");
    const [newFromDate, setNewFromDate] = useState(fromDate || "");
    const [newToDate, setNewToDate] = useState(toDate || "");
    const [newStatus, setNewStatus] = useState(status || "");
    // console.log("class owner" , classOwner)
    // c localStorage.getItem('email').replace(/"/g, ""))
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
          const response = await axios.put(
            `http://localhost:4000/attandence-service/api/submissions/updateSubmission/`, // Địa chỉ API của bạn
            { newTitle, newContent, newFromDate, newToDate, newEvidence, submissionId, newStatus}, // Gửi email trong body của yêu cầu
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
              },
            }
          );
    
          if (response.data.success) {
            toast.success('Update new attendences successfully');
            socket.emit("notification", {notification: response?.data.notification})
            
            refreshData();
            onClose
          }
        } catch (error) {
          console.error('Error adding attend:', error);
          toast.error(error.response.data.message);
        }
      };

      const handleDelete = async () => {
        // Handle the form submission here        try {
          // Gọi API để xử lý email
          try{
            console.log(submissionId);
          const response = await axios.delete(
            `http://localhost:4000/attandence-service/api/submissions/deleteSubmission/${submissionId}`, // Địa chỉ API của bạn
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
              },
            }
          );
    
          if (response.data.success) {
            toast.success('Delete attendences successfully');
            refreshData();
            onClose
          }
        } catch (error) {
          console.error('Error adding attend:', error);
          toast.error(error.response.data.message);
        }
      }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[50%] ">
                <h2 className="text-lg font-semibold mb-4 text-center">Update Submission</h2>
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

                {localStorage.getItem('email').replace(/"/g, "") === classOwner ? <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                    <select 
                        id="status" 
                        className="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setNewStatus(e.target.value)}
                        value={newStatus}
                    >
                        <option value="Rejected">Reject</option>
                        <option  value="Approved">Aproved</option>
                        <option  value="Pending">Pending</option>

                    </select>
                </div> : null}

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
                        onClick={handleDelete}
                        className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                    >
                        Delete
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
