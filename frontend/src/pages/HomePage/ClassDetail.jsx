import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClassCard from '~/components/common/ClassCard';
import { motion } from "framer-motion";
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/common/Header';
import UsersTable from "../../components/users/UsersTable";

function ClassDetail() {
    const navigate = useNavigate();
    
    const { id } = useParams(); // Lấy ID từ URL
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
    
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
                toast.error(response.data.message);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              toast.error("Error fetching classrooms");
            });
        }
      }, [navigate]);
    

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          // Nếu không có token, chuyển hướng đến trang login
          navigate("/login");
        } else {
          // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
          axios
            .get(`http://localhost:4000/classroom-service/api/classrooms/getUserFromClass/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                setStudents(response.data.students);
                toast.error(response.data.message);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              toast.error("Error fetching classrooms");
            });
        }
      }, [navigate]);
      
      console.log(classroom)
      console.log(students)
  return (
    <>
      		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<UsersTable userData={students}/>

			</main>
		</div>
    </>
  )
}

export default ClassDetail