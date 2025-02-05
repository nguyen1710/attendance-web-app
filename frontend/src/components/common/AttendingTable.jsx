/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { color, motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";

// const userData = [
// 	{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
// 	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
// 	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
// 	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
// 	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
// ];

const UsersTable = ({
  title,
  attendeesData,
  nonAttendeesData,
  classOwner,
  className,
  methodAttend,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { attendanceId } = useParams();
  // const [filteredUsers, setFilteredUsers] = useState(userData)
  const [attendees, setAttendees] = useState();
  const [nonAttendees, setNonAttendees] = useState();
  const [idCard, setIdCard] = useState()
  const [method, setMethod] = useState()
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    setAttendees(attendeesData);
    setNonAttendees(nonAttendeesData);
    setMethod(methodAttend)
  }, [attendeesData, nonAttendeesData, methodAttend]);

  const numberOfStudents = attendeesData.length + nonAttendeesData.length;

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    // Lấy các thành phần giờ, phút, ngày, tháng, năm
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Kết hợp thành định dạng hh:mm dd/mm/yyyy
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  const refreshData = () => {
    axios
      .get(
        `${API_URL_BASE}/attendance-service/api/attendances/getAttendance/${attendanceId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          setNonAttendees(response.data.session.nonAttendees);
          setAttendees(response.data.session.attendees);
          toast.success("Check Attendance successfully!!!");
        } else {
          toast.error("Something wrong!!!"); // Hiển thị lỗi từ server
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred"); // Hiển thị lỗi
      });
  };

  const handleInputIdCardChange = (e) => {
    const value = e.target.value;
    setIdCard(value);
    console.log(value)
    // Kiểm tra nếu giá trị có 10 ký tự
    if (value.length === 10) {
      // Gọi API ở đây
      handleCheckAttendanceByIdCard(value);
    }
  };

  const handleCheckAttendanceByIdCard = async (value) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL_BASE}/attendance-service/api/attendances/checkAttendanceByIdCard/${attendanceId}`,
        { idCard: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.data.success) {
        // setSuccessMessage(response.data.message);
        // Optionally, you can store the user data in state or localStorage
        toast.success(response.data.message);
        setIdCard("")
        refreshData();
        // navigate('/')
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setIdCard("")
      console.error("Error data data:", error); // Bắt lỗi nếu có
    }
    // console.log(email)
  };

  const handleCheckAttend = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL_BASE}/attendance-service/api/attendances/checkAttendance/${attendanceId}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.data.success) {
        // setSuccessMessage(response.data.message);
        // Optionally, you can store the user data in state or localStorage
        toast.success(response.data.message);
        refreshData();
        // navigate('/')
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error data data:", error); // Bắt lỗi nếu có
    }
    // console.log(email)
  };

  const checkPermission = (excuse) => {
    if (excuse == true) {
      return "Absent with Permission";
    }
    return "Absent no with Permission";
  };

  const exportToExcel = () => {
    // Chuẩn bị dữ liệu
    const data = [
      ...attendees.map((student) => ({
        Name: student.username,
        Email: student.email,
        "Attendance Time": formatDateTime(student.timestamp),
        Excuse: "Attend", // Đã điểm danh thì không có phép
      })),
      ...nonAttendees.map((student) => ({
        Name: student.username,
        Email: student.email,
        "Attendance Time": "N/A",
        Excuse: checkPermission(student.excused), // Không điểm danh thì có phép
      })),
    ];

    // Tạo WorkBook và WorkSheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Attendance Report: "${className}"`]],
      { origin: "A1" }
    );
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }]; // Hợp nhất từ A1 đến D1

    XLSX.utils.sheet_add_json(worksheet, data, {
      origin: "A2",
      skipHeader: false,
    });

    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(
        key.length, // Độ dài tiêu đề cột
        ...data.map((row) => (row[key] ? row[key].toString().length : 0)) // Độ dài dữ liệu
      ),
    }));
    worksheet["!cols"] = colWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Xuất file
    XLSX.writeFile(
      workbook,
      `Attendance_${className}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
  console.log(nonAttendeesData);
  return (
    <>
      {method === "IDCard" ? (
        <div className="flex justify-end ">
          <div className="flex-col">
            <label
              htmlFor="IDCard"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Card Input here
            </label>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                maxLength="10"
                id="IDCard"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ID"
                value={idCard}
                onChange={handleInputIdCardChange}
              />
            </div>

          </div>
        </div>
      ) : null}
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {title} List
              </h3>
              <p className="text-slate-500">
                List of {title}: {attendeesData.length}/{numberOfStudents}
              </p>
            </div>
          </div>
        </div>
        <div className="p-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    User
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>

                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    {title === "Attendees" ? "Time" : "Status"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>

                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500"></p>
                </th>
              </tr>
            </thead>

            <tbody>
              {attendees ? (
                attendees.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.imageUrl}
                            alt="John Michael"
                            className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-700">
                              {user.username}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4 border-b border-slate-200">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {user.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {truncateContent(user.content, 30)}
                                                    </p>
                                                </div>
                                            </td> */}
                      <td className="p-4 border-b border-slate-200">
                        <div className="w-max">
                          {/* <div className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold ${getStatusColor(user.status)} uppercase rounded-md select-none whitespace-nowrap`}> */}
                          <div
                            className={`relative grid items-center px-2 py-1  uppercase rounded-md select-none whitespace-nowrap`}
                          >
                            {formatDateTime(user.timestamp)}
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4 border-b border-slate-200">
                                                <p className="text-sm text-slate-500">{formatDate(user.createdAt)}</p>
                                            </td> */}
                      <td className="p-4 border-b border-slate-200">
                        {localStorage.getItem("email").replace(/"/g, "") ===
                        classOwner ? (
                          <a>Bằng chứng</a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                {title} List
              </h3>
              <p className="text-slate-500">
                List of {title}: {nonAttendeesData.length}/{numberOfStudents}
              </p>
            </div>
          </div>
        </div>
        <div className="p-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    User
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>

                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    {title === "Attendees" ? "Time" : "Status"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                </th>

                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500"></p>
                </th>
              </tr>
            </thead>

            <tbody>
              {nonAttendees ? (
                nonAttendees.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.imageUrl}
                            alt="John Michael"
                            className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-700">
                              {user.username}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4 border-b border-slate-200">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {user.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {truncateContent(user.content, 30)}
                                                    </p>
                                                </div>
                                            </td> */}
                      <td className="p-4 border-b border-slate-200">
                        <div className="w-max">
                          {/* <div className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold ${getStatusColor(user.status)} uppercase rounded-md select-none whitespace-nowrap`}> */}
                          <div
                            className={`relative grid items-center px-2 py-1  uppercase rounded-md select-none whitespace-nowrap`}
                          >
                            {user.excused ? (
                              <span className="text-green-500 font-sans text-xs font-bold ">
                                Vắng có phép
                              </span>
                            ) : (
                              <span className="text-red-500 font-sans text-xs font-bold ">
                                Vắng không phép
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4 border-b border-slate-200">
                                                <p className="text-sm text-slate-500">{formatDate(user.createdAt)}</p>
                                            </td> */}
                      <td className="p-4 border-b border-slate-200">
                        {localStorage.getItem("email").replace(/"/g, "") ===
                        classOwner ? (
                          <a
                            className="underline cursor-pointer hover:text-red-500"
                            onClick={() => handleCheckAttend(user.email)}
                          >
                            Điểm danh
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="relative w-full">
        <button
          type="button"
          onClick={exportToExcel}
          // disabled={isUploading}
          className=" absolute right-0 text-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Export Exel
          {/* {isUploading ? "Uploading..." : "Import Excel Students"} */}
        </button>
      </div>
    </>
  );
};
export default UsersTable;
