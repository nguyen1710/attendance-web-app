/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SidebarHomePage from "~/components/common/SidebarHomePage";
import Header from "~/components/common/Header";
import { motion } from "framer-motion";
import AttendingTable from "~/components/common/AttendingTable";
import { QRCode } from "react-qrcode-logo";
import logo from "~/public/img/logo.png";
import Swal from "sweetalert2";
const AttendanceSession = () => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  //   const [classroomId, setClassroomId] = useState('');
  const [qrCode, setQrCode] = useState("");
  const [method, setMethod] = useState("");
  const [nonAttendees, setNonAttendees] = useState([]);
  const [className, setClassName] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const { classId, attendanceId } = useParams();
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("token",token)
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
      axios
        .get(
          `${API_URL_BASE}/attendance-service/api/attendances/getAttendance/${attendanceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setQrCode(response.data.session.qrCode);
            setNonAttendees(response.data.session.nonAttendees);
            setAttendees(response.data.session.attendees);
            setOwner(response.data.session.classOwner);
            setClassName(response.data.session.className);
            setMethod(response.data.session.method)
            toast.success("Attendance Session Page!!!");
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


  return (
    <>
      <SidebarHomePage />
      <div className="flex-1 overflow-auto relative z-10">
        <Header username={username} email={email} title="Attendence" />

        <main className="w-full mx-auto py-6 px-4 lg:px-8">
        {/* Hiển thị QR Code nếu có */}
                {qrCode && (
                  <div className="flex justify-center mb-8">
                    <QRCode
                      value={qrCode}
                      size={200}
                      logoWidth={50}
                      logoImage={logo}
                      fgColor="#f17ab6"
                      bgColor="#fff"
                      eyeColor={['#9469d7','#efbd75', '#70c2b4' ]}
                    />
                  </div>
                )}         
          <motion.div
            className="grid grid-cols-1 gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <AttendingTable
              title={"Attendees"}
              classOwner={owner}
              attendeesData={attendees}
              nonAttendeesData={nonAttendees}
              className={className}
              methodAttend= {method}
            />
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AttendanceSession;
