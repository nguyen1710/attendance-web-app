// Dialog.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import CreateAttendance from "../Dialog/CreateAttendance";
import { UserRoundCheck,  IdCard, QrCode, Fingerprint, ScanFace } from "lucide-react";
import { useParams } from 'react-router-dom';
function SelectAttendanceMethodDialog({ isOpen, onClose }) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [ method, setMethod ] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // console.log(id)
    const {classId} = useParams()
    const closeDialog = () => {
      setIsDialogOpen(false);
      onClose(); // Gọi hàm onClose để đóng SelectAttendanceMethodDialog
    };
    const openDialog = () => setIsDialogOpen(true);
  if (!isOpen) return null;
  // const handleCreate = async () => {
  //   try {
  //     // Gọi API để xử lý email
  //     const response = await axios.post(
  //       'http://localhost:4000/attandence-service/api/attendances/createAttandence', // Địa chỉ API của bạn
  //       { classroomId, name, desc }, // Gửi email trong body của yêu cầu
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần gửi token xác thực
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       toast.success('Create new attendences successfully');
       
  //       setName(""); // Reset dữ liệu form
  //       setDesc("");
  //       // onClose(); // Đóng dialog
  //       // window.location.reload(); // Làm mới toàn bộ trang
  //       refreshData();
  //       onClose
  //     }
  //   } catch (error) {
  //     console.error('Error adding attend:', error);
  //     toast.error(error.response.data.message);
  //   }
  // };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[50%]">
      <h2 className="text-lg font-semibold mb-4">Please select a check attendance method </h2>
          <button
                type="button"
                // onClick={openDialog}
                className="flex items-center w-full h-20 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 "
                onClick={() => {
                  setMethod("Normal")
                  openDialog()
                }}
              >
                <UserRoundCheck className="w-5 h-5 mr-2" />
                  Normal Attendance
              </button>

              <button
                type="button"
                onClick={() => {
                  openDialog()
                  setMethod("QR")
                }}
                className="flex items-center w-full h-20 h-20 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2"
              >
                <QrCode className="w-5 h-5 mr-2" />
                  QR Attendance
              </button>

              <button
                type="button"
                onClick={() => {
                  openDialog()
                  setMethod("IDCard")
                }}
                className="flex items-center w-full h-20 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 "
              >
                <IdCard className="w-5 h-5 mr-2" />
                  ID Card Attendance
              </button>

              <button
                type="button"
                onClick={() => {
                  openDialog()
                  setMethod("Fingerprint")
                }}
                className="flex items-center w-full h-20 text-white bg-pink-500 hover:bg-pink-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 "
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                  Fingerprint Attendance
              </button>

              <button
                type="button"
                onClick={() => {
                  openDialog()
                  setMethod("Face")
                }}
                className="flex items-center w-full h-20 text-white bg-purple-500 hover:bg-purple-600 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 "
              >
                <ScanFace className="w-5 h-5 mr-2" />
                  Face recognition Attendance
              </button>
        <div className='flex justify-end mt-4'>

              <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Cancel
                    </button>
        </div>

    
    </div>
    <CreateAttendance
            isOpen={isDialogOpen}
            onClose={closeDialog}
            classroomId={classId}
            method={method}
          /> 
  </div>


  );
}

export default SelectAttendanceMethodDialog;
