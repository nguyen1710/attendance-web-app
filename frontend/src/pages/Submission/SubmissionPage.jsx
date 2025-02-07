/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import SidebarHomePage from '~/components/common/SidebarHomePage'
import { toast } from "react-toastify";
// import { CirclePlus } from 'lucide-react';
import TabclassNameRoom from '~/components/common/TabclassRoom';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '~/components/common/Header';
import SubmissionTable from './SubmissionTable/SubmissionTable';

function SubmissionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const { classId } = useParams(); // Lấy ID từ URL
  const [submission, setSubmission] = useState(null)
  const [classOwner, setClassOwner] = useState("")
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
      axios
        .get(`${API_URL_BASE}/attendance-service/api/submissions/getSubmissions/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        })
        .then((response) => {
          if (response.data.success) {
            setSubmission(response.data.submissions);
            setClassOwner(response.data.classOwner)
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

  console.log(submission)
  return (
    <>
    <SidebarHomePage/>
        <div className='flex-1 overflow-auto relative z-10'>
        <Header username={username} email={email} title={"Submission"}/>
        <TabclassNameRoom classId={classId} currentTab={'submission'}/>

			<main className='w-full py-6 px-4 lg:px-8'>
        <div className="flex justify-end">
      </div>

          <SubmissionTable submissionsData={submission} classOwner={classOwner}/>



			</main>
		</div>
    </>
  )
}

export default SubmissionPage