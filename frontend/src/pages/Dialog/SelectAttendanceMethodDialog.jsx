/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// Dialog.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CreateAttendance from "../Dialog/CreateAttendance";
import Swal from "sweetalert2"
import { motion } from "framer-motion";
import {
  UserRoundCheck,
  IdCard,
  QrCode,
  Fingerprint,
  ScanFace,
} from "lucide-react";
import { useParams } from "react-router-dom";
function SelectAttendanceMethodDialog({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [method, setMethod] = useState("");
  const [levelUser, setLevelUser] = useState("");
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  const navigate = useNavigate()

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log(id)
  const { classId } = useParams();
  const closeDialog = () => {
    setIsDialogOpen(false);
    onClose(); // Gọi hàm onClose để đóng SelectAttendanceMethodDialog
  };
  const openDialog = () => setIsDialogOpen(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("token",token)
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
      axios
        .post(
          `${API_URL_BASE}/user-service/api/user/getLevelUser`,{email: email.replace(/"/g, '')},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setLevelUser(response.data.level);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    }
  }, [navigate]);
  // console.log(levelUser)
  if (!isOpen) return null;

  const confirmUpgrade = () => {
    Swal.fire({
      title: "You want upgrade?",
      text: "Features for Higher level users!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upgrade it!"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/upgrade`
      }
    });
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[50%]">
        <h2 className="text-lg font-semibold mb-4">
          Please select a check attendance method{" "}
        </h2>
        <button
          type="button"
          // onClick={openDialog}
          className="flex items-center w-full h-20 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-4 "
          onClick={() => {
            setMethod("Normal");
            openDialog();
          }}
        >
          <UserRoundCheck className="w-5 h-5 mr-2" />
          Normal Attendance
        </button>

        <button
          type="button"
          onClick={() => {
            // openDialog();
            if(levelUser < 2) {
              confirmUpgrade()
            } else {
              openDialog();
              setMethod("QR");
            }
          }}
          className="relative flex items-center w-full h-20 h-20 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-4"
        >
          <QrCode className="w-5 h-5 mr-2" />
          QR Attendance
          {/* {levelUser < 2 ? (<div className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900">Premium</div>) : null} */}
          {levelUser < 2 ? (
            <motion.div
              className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900"
              animate={{ x: [0, -1, 1, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Premium
            </motion.div>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => {
            if(levelUser < 2) {
              confirmUpgrade()
            } else {
              openDialog();
              setMethod("IDCard");
            }
            
          }}
          className="relative flex items-center w-full h-20 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-3 "
        >
          <IdCard className="w-5 h-5 mr-2" />
          ID Card Attendance
          {/* {levelUser < 2 ? (<div className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900">Premium</div>) : null} */}
          {levelUser < 2 ? (
            <motion.div
              className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900"
              animate={{ x: [0, -1, 1, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Premium
            </motion.div>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => {
            if(levelUser < 3) {
              confirmUpgrade()
            } else {
              openDialog();
              setMethod("Fingerprint");
            }
          }}
          className="relative flex items-center w-full h-20 text-white bg-pink-500 hover:bg-pink-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-4 "
        >
          <Fingerprint className="w-5 h-5 mr-2" />
          Fingerprint Attendance
          {/* {levelUser < 3 ? (<div className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900">VIP Premium</div>) : null} */}
          {levelUser < 3 ? (
            <motion.div
              className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900"
              animate={{ x: [0, -1, 1, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              VIP Premium
            </motion.div>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => {
            if(levelUser < 3) {
              confirmUpgrade()
            } else {
              openDialog();
              setMethod("Face");
            }
          }}
          className="relative flex items-center w-full h-20 text-white bg-purple-500 hover:bg-purple-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-4 "
        >
          <ScanFace className="w-5 h-5 mr-2" />
          Face recognition Attendance
          {/* {levelUser < 3 ? (<div className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900">VIP Premium</div>) : null} */}
          {levelUser < 3 ? (
            <motion.div
              className="absolute inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-4 dark:border-gray-900"
              animate={{ x: [0, -1, 1, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              VIP Premium
            </motion.div>
          ) : null}
        </button>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>
      <CreateAttendance
        isOpen={isDialogOpen}
        onClose={closeDialog}
        classroomId={classId}
        method={method}
      />
    </div>
  );
}

export default SelectAttendanceMethodDialog;
