/* eslint-disable no-unused-vars */
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
import { CirclePlus } from 'lucide-react';
import AddStudentDialog from '../Dialog/AddStudentDialog';
import TabClassRoom from '../../components/common/TabClassRoom';
function ClassDetailUsers() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const { classId } = useParams(); // Lấy ID từ URL
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

     // Hàm đóng dialog
  const closeDialog = () => setIsDialogOpen(false);

  // Hàm mở dialog
  const openDialog = () => setIsDialogOpen(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          // Nếu không có token, chuyển hướng đến trang login
          navigate("/login");
        } else {
          // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
          axios
            .get(`http://localhost:4000/classroom-service/api/classrooms/getUserFromClass/${classId}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                setStudents(response.data.students);
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              toast.error("Error fetching classrooms");
            });
        }
      }, [navigate]);
      
      // console.log(classroom)
      // console.log(students)
  return (
    <>
    <SidebarHomePage/>
        <div className='flex-1 overflow-auto relative z-10'>
        <Header username={username} email={email} title={"Users"}/>
        <TabClassRoom classId={classId} currentTab={'user'}/>

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openDialog}
            className="flex items-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <CirclePlus className="w-5 h-5 mr-2" />
            Add Student
          </button>
      </div>
				<UsersTable title={"Users"} userData={students}/>
        <AddStudentDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          id={classId}

        />
			</main>
		</div>
    </>
  )
}

export default ClassDetailUsers