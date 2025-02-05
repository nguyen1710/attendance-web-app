/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClassCard from '~/components/common/ClassCard';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from "react-toastify";
import Header from '../../components/common/Header';
import UsersTable from '../../components/common/UsersTable';
import SidebarHomePage from '../../components/common/SidebarHomePage';
import { CirclePlus } from 'lucide-react';
import { FileInput } from 'lucide-react';
import AddStudentDialog from '../Dialog/AddStudentDialog';
import TabClassRoom from '../../components/common/TabClassRoom';
function ClassDetailUsers() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const { classId } = useParams(); // Lấy ID từ URL
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [owner, setOwner] = useState("");
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const fileInputRef = useRef(null); // Tạo tham chiếu đến input file
    const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

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
            .get(`${API_URL_BASE}/classroom-service/api/classrooms/getUserFromClass/${classId}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                setStudents(response.data.students);
                setTeachers(response.data.teachers)
                setOwner(response.data.owner)
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
      console.log("studentsss",students)
      console.log("teachersss",teachers)

      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          setUploadStatus("No file selected");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", classId); // Thêm ID của lớp học
    
        setIsUploading(true);
        setUploadStatus("");
    
        try {
          const response = await axios.post(`${API_URL_BASE}/classroom-service/api/classrooms/upload-excel`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            setUploadStatus("Emails sent successfully!");
            toast.success(uploadStatus);
            window.location.reload();
          } else {
            setUploadStatus("Failed to send emails: " + response.data.message);
            toast.error(uploadStatus);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          setUploadStatus("Error uploading file. Please try again.");
        } finally {
          setIsUploading(false);
          e.target.value = ""; // Reset input file
        }
      };
    
      const handleButtonClick = () => {
        fileInputRef.current.click(); // Kích hoạt click vào input file
      };
    
  return (
    <>
    <SidebarHomePage/>
        <div className='flex-1 overflow-auto relative z-10'>
        <Header username={username} email={email} title={"Users"}/>
        <TabClassRoom classId={classId} currentTab={'user'}/>

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='pb-7'>
          <UsersTable title={"Teachers"} userData={teachers}/>
        </div>

        {email.replace(/"/g, "") === owner ? (<div className="flex justify-end pb-2">
          <button
            type="button"
            onClick={openDialog}
            className="flex items-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <CirclePlus className="w-5 h-5 mr-2" />
            Add Student
          </button>
          <div className="flex flex-col items-center">
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: "none" }} // Ẩn input file
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="flex items-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {isUploading ? "Uploading..." : "Import Excel Students"}
          </button>
        </div>
       </div>) : null}
        

				<UsersTable title={"Classmates"} userData={students}/>
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