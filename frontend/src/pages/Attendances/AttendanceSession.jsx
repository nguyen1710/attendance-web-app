import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SidebarHomePage from '~/components/common/SidebarHomePage';
import Header from '~/components/common/Header';
import { motion } from 'framer-motion';
import UsersTable from '~/components/common/UsersTable';
import {QRCode} from 'react-qrcode-logo'
import logo from "~/public/img/logo.png"
const AttendanceSession = () => {
const [email, setEmail] = useState(localStorage.getItem('email'));
const [username, setUsername] = useState(localStorage.getItem('username'));
//   const [classroomId, setClassroomId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [nonAttendees, setNonAttendees] = useState([])
  const [attendees, setAttendees] = useState([])

  const navigate = useNavigate()
  const {classId,attendanceId } = useParams()

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("token",token)
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
      axios
        .get(`http://localhost:4000/attandence-service/api/attendances/getAttendance/${attendanceId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        })
        .then((response) => {
          if (response.data.success) {
            setQrCode(response.data.session.qrCode);
            setNonAttendees(response.data.session.nonAttendees)
            setAttendees(response.data.session.attendees)

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
  console.log(attendees)
  console.log(nonAttendees)
  return (
    // <div>
    //   <input
    //     type="text"
    //     value={classroomId}
    //     onChange={(e) => setClassroomId(e.target.value)}
    //     placeholder="Enter Classroom ID"
    //   />
    //   {qrCode && <img src={qrCode} alt="QR Code" />}
    // </div>

        <>
        <SidebarHomePage />
            <div className='flex-1 overflow-auto relative z-10'>
            <Header username={username} email={email} title="Attendence"/>

                <main className='w-full mx-auto py-6 px-4 lg:px-8'>

                 {/* Hiển thị QR Code nếu có */}
                {qrCode && (
                    <div className="flex justify-center mb-8">
                    < QRCode 
                      value={qrCode} 
                      size={200}
                      logoWidth={40}
                      logoImage={logo}
                      fgColor='#f17ab6'
                      bgColor='#fff'
                      // eyeColor={['#9469d7','#efbd75', '#70c2b4' ]}
                      />
                    </div>
                )}

                
                <motion.div
					className='grid grid-cols-1 gap-5 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
              <UsersTable title={"Attendees"} userData={attendees}/>

              <UsersTable title={"Non Attendees"} userData={nonAttendees}/>
        
        
                </motion.div>


                </main>
            </div>
        </>
  );
};

export default AttendanceSession;
