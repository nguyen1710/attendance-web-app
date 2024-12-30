import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClassCard from '~/components/common/ClassCard';
import { motion } from "framer-motion";
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/common/Header';
import UsersTable from '../../components/common/UsersTable';
import SidebarHomePage from '../../components/common/SidebarHomePage';
import { Link } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import CreateAttendance from '../Dialog/CreateAttendance';

function ClassDetail() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const { id } = useParams(); // Lấy ID từ URL
    const [classroom, setClassroom] = useState(null);
    const [attendances, setAttendance] = useState([])
    
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log(id)

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
            .get(`http://localhost:4000/classroom-service/api/classrooms/getClassroom/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                setClassroom(response.data.classroom);
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              console.log(error)
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
            .get(`http://localhost:4000/attandence-service/api/attendances/getAllAttendances/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                setAttendance(response.data.data);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              console.log(error)
              toast.error(error.response.data.message);
            });
        }
      }, [navigate]);
      
      console.log(classroom)
      console.log(attendances)

    //   console.log(students)
  return (
    <>
    <SidebarHomePage />
        <div className='flex-1 overflow-auto relative z-10'>
        <Header username={username} email={email}/>

			<main className='w-full mx-auto py-6 px-4 lg:px-8'>
        <div className="flex justify-end">
            <button
              type="button"
              onClick={openDialog}
              className="flex items-center text-white bg-primary-100 hover:bg-primary-300 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              <CirclePlus className="w-5 h-5 mr-2" />
              New Attendance
            </button>
        </div>
      <motion.div
					className='grid grid-cols-1 gap-5 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
        {
          attendances.map((attendance) => (
            <Link to={`/attendances/${attendance._id}`} key={attendance._id}>
              <ClassCard
                name= {attendance?.name}
                owner={classroom?.owner || 'N/A'}
                desc={attendance?.desc}
                color="#6366F1"
              />
            </Link>
            
          )
              
        )}
        
      </motion.div>
				{/* <UsersTable userData={students}/> */}
        <CreateAttendance
          isOpen={isDialogOpen}
          onClose={closeDialog}
          classroomId={id}
          refreshData={() => {
            axios
              .get(`http://localhost:4000/attandence-service/api/attendances/getAllAttendances/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                if (response.data.success) {
                  setAttendance(response.data.data);
                  setIsDialogOpen(false)
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
  )
}

export default ClassDetail