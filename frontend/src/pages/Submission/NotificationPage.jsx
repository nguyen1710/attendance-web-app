import React, {useState, useEffect} from 'react'
import axios from 'axios'
import SidebarHomePage from '~/components/common/SidebarHomePage'
import toast from 'react-hot-toast';
// import { CirclePlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '~/components/common/Header';
import NotificationTable from './Notification Table/NotificationTable';
function NotificationPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (!token) {
          // Nếu không có token, chuyển hướng đến trang login
          navigate("/login");
        } else {
          // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
          axios
            .get(`http://localhost:4000/attendance-service/api/submissions/getNotification`, {
              headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
              },
            })
            .then((response) => {
              if (response.data.success) {
                const sortedNoti =  response.data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setNotifications(sortedNoti);
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
              }
            })
            .catch((error) => {
              console.log(error)
            });
        }
      }, [navigate]);

      console.log("Nõti",notifications)
  return (
    <>
        <div className='flex-1 overflow-auto relative z-10'>
        <Header username={username} email={email} title={"Notification"}/>
        {/* <TabclassNameRoom classId={classId} currentTab={'submission'}/> */}

			<main className='max-width mx-auto py-6 px-4 lg:px-8'>
        <div className="flex justify-end">
          {/* <button
            type="button"
            onClick={openDialog}
            classNameName="flex items-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <CirclePlus classNameName="w-5 h-5 mr-2" />
            Add Student
          </button> */}
      </div>
        {/* <AddStudentDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          id={classNameId}

        /> */}

          <NotificationTable notificationsData={notifications}/>



			</main>
		</div>
        </>
  )
}

export default NotificationPage