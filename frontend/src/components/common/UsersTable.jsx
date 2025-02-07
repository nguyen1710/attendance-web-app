/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
const UsersTable = ({ title, userData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(userData);
  const [users, setUsers] = useState(userData);
  const navigate = useNavigate();
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL;
  const { classId } = useParams();
  useEffect(() => {
    setUsers(userData);
  }, [userData]);
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };


  const handleDeleteUser = async ({ userEmail }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      try {
        // Gọi API để xử lý email
        const response = await axios.post(
          `${API_URL_BASE}/classroom-service/api/classrooms/deleteUserInClass`,
          { classId, userEmail }, // Body (nếu không có thì để trống `{}`)
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token đúng cách
            },
          }
        );

        if (response.data.success) {
          await Swal.fire({
            title: "Deleted!",
            text: "The attendance has been deleted.",
            icon: "success",
          });
          window.location.reload()
        }
      } catch (error) {
        console.error("Error delete class:", error);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {title} List
              </h3>
              <p className="text-slate-500">
                List of {title.toLowerCase()}: {userData.length}
              </p>
            </div>
          </div>
        </div>
        <div className="p-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    User
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>

                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Action
                  </p>
                </th>
              </tr>
            </thead>

            <tbody>
              {users ? (
                users.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.imageUrl}
                            alt="John Michael"
                            className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-700">
                              {user.username}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        className="p-4 border-b cursor-pointer text-red-500 border-slate-200"
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure delete this user?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              handleDeleteUser({ userEmail: user.email });
                            }
                          });
                        }}
                      >
                        <Trash2 />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">Page 1 of 10</p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default UsersTable;
