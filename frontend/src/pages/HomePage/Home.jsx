/* eslint-disable no-unused-vars */
import React from 'react'
import Logo from '~/public/img/logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassCard from '~/components/common/ClassCard';
import { motion } from "framer-motion";
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/common/Header';
import { Link } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import CreateClassDialog from '../Dialog/CreataClassDialog';
function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [classrooms, setClassrooms] = useState([])
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
        .get("http://localhost:4000/classroom-service/api/classrooms/getClassrooms", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        })
        .then((response) => {
          if (response.data.success) {
            setClassrooms(response.data.classes);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.error("Error fetching classrooms");
          console.log(error)
        });
    }
  }, [navigate]);
  
  const handleCreate = () => {}
  return (
    <>
      <div className='flex-1 min-h-screen overflow-auto relative z-10 bg-[#E4E6EB]'>
      <Header username={username} email={email} title="Home"/>
			<main className='w-full min-h-screen	 mx-auto py-6 px-4 lg:px-8 '>
      <motion.div
					// className='grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
          className="grid gap-5 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:grid-cols-3 mb-8"

					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
          {
            classrooms.map((classroom) => (
              <Link to={`/classroom/${classroom._id}`} key={classroom._id}>
                {/* <ClassCard
                  name={classroom.name}
                  owner={classroom.owner}
                  desc={classroom.description}
                  color="#6366F1"
                /> */}
          
                  <ClassCard classroom={classroom} />
                
          </Link>
            ))
        
}
  
          <motion.div
            className='bg-[#E4E6EB] backdrop-blur-md min-h-28 overflow-hidden shadow-lg rounded-xl cursor-pointer border border-gray-300 border-dashed border-4 mb-3 opacity-80 flex items-center justify-center'
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            onClick={openDialog}
          >
            <div className="flex items-center space-x-2 text-lgxl font-bold text-gray-500">
              <CirclePlus className="w-8 h-8" />
              <span>Create Class</span>
            </div>
          </motion.div>
        </motion.div>
        <CreateClassDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          refreshData={() => {
            const token = localStorage.getItem("token");

            axios
              .get("http://localhost:4000/classroom-service/api/classrooms/getClassrooms", {
                headers: {
                  Authorization: `Bearer ${token}`, // Gửi token trong header
                },
              })
              .then((response) => {
                if (response.data.success) {
                  setClassrooms(response.data.classes);
                  setIsDialogOpen(false)
                } else {
                  toast.error(response.data.message);
                }
              })
              .catch((error) => {
                toast.error("Error fetching classrooms");
              });
                }}

        />
			</main>
		</div>
    </>
  
  )
}

export default Home