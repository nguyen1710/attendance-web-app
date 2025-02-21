// Dialog.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
function AddUserDialog({ isOpen, onClose, id, type }) {
  const [email, setEmail] = useState("");
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL;
  if (!isOpen) return null;
  const handleAddStudent = async () => {
    try {
      // Gọi API để xử lý email
      const response = await axios.post(
        `${API_URL_BASE}/classroom-service/api/classrooms/add-student`, // Địa chỉ API của bạn
        { id, email }, // Gửi email trong body của yêu cầu
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Adding successfully!",
          text: `${type} ${email} has been added to this class.`,
          icon: "success",
        });
        window.location.reload();
        // onSubmit();  // Gọi callback để đóng dialog hoặc làm gì đó sau khi thành công
        setEmail(""); // Reset lại email
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding email:", error);
      toast.error("Failed to add email");
    }
  };

  const handleAddTeacher = async () => {
    try {
      // Gọi API để xử lý email
      const response = await axios.post(
        `${API_URL_BASE}/classroom-service/api/classrooms/add-teacher`, // Địa chỉ API của bạn
        { id, email }, // Gửi email trong body của yêu cầu
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Adding successfully!",
          text: `${type} ${email} has been added to this class.`,
          icon: "success",
        });
        window.location.reload();
        // onSubmit();  // Gọi callback để đóng dialog hoặc làm gì đó sau khi thành công
        setEmail(""); // Reset lại email
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding email:", error);
      toast.error("Failed to add email");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add {type}</h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            placeholder="Enter email"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              Swal.fire({
                title: `Are you sure add this ${type}?`,
                text: "You won't be able to revert this!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, add it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  if (type === "Student") {
                    handleAddStudent();
                  } else {
                    handleAddTeacher();
                  }
                }
              });
            }}
            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 bg-gray-200 hover:bg-warning focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUserDialog;
