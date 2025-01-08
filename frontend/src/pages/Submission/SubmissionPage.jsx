/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import SidebarHomePage from '~/components/common/SidebarHomePage'
import toast from 'react-hot-toast';
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Nếu không có token, chuyển hướng đến trang login
      navigate("/login");
    } else {
      // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
      axios
        .get(`http://localhost:4000/attandence-service/api/submissions/getSubmissions/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        })
        .then((response) => {
          if (response.data.success) {
            setSubmission(response.data.submissions);
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

          <SubmissionTable submissionsData={submission}/>



			</main>
		</div>
    </>
  )
}

export default SubmissionPage