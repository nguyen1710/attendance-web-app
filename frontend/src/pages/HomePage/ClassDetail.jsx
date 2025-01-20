import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AttendanceCard from "~/components/common/AttendanceCard";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/common/Header";
import SidebarHomePage from "../../components/common/SidebarHomePage";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import TabClassRoom from "../../components/common/TabClassRoom";
import SelectAttendanceMethodDialog from "../Dialog/SelectAttendanceMethodDialog";
function ClassDetail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const { classId } = useParams(); // Lấy ID từ URL
  const [classroom, setClassroom] = useState(null);
  const [attendances, setAttendance] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log(id)

  const closeDialog = () => setIsDialogOpen(false);
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
        .get(
          `http://localhost:4000/classroom-service/api/classrooms/getClassroom/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        )
        .then((response) => {
          if (response.data.success) {

            setClassroom(response.data.classroom);
            toast.success(response.data.message);
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
          `http://localhost:4000/attandence-service/api/attendances/getAllAttendances/${classId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            const attendanceData = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]; // Chuyển thành mảng nếu không phải là mảng

          const sortedAttendance = [...attendanceData].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          console.log(sortedAttendance)
            setAttendance(sortedAttendance);
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

  //   console.log(students)
  return (
    <>
      <SidebarHomePage />
      <div className="flex-1 overflow-auto relative z-10">
        <Header username={username} email={email} title={classroom?.name} />
        <TabClassRoom classId={classId} currentTab={"attendance"} />

        <main className="w-full mx-auto py-6 px-4 lg:px-8 ">
          {email.replace(/"/g, "") === classroom?.owner ? (
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={openDialog}
                className="flex items-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                <CirclePlus className="w-5 h-5 mr-2" />
                New Attendance
              </button>
            </div>
          ) : null}

          <motion.div
            className="grid grid-cols-1 gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {attendances.map((attendance) => (
              <Link
                to={`/classroom/${classId}/attendance/${attendance._id}`}
                key={attendance._id}
              >
                <AttendanceCard
                  name={attendance?.name}
                  owner={classroom?.owner || "N/A"}
                  desc={attendance?.desc}
                  method={attendance?.method}
                  color="#6366f1"
                />
              </Link>
            ))}
          </motion.div>
          {/* <UsersTable userData={students}/> */}
          <SelectAttendanceMethodDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            refreshData={() => {
              axios
                .get(
                  `http://localhost:4000/attandence-service/api/attendances/getAllAttendances/${classId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((response) => {
                  if (response.data.success) {
                    setAttendance(response.data.data);
                    setIsDialogOpen(false);
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch((error) => {
                  console.log(error);
                  toast.error(error.response.data.message);
                });
            }}
          />
        </main>
      </div>
    </>
  );
}

export default ClassDetail;
