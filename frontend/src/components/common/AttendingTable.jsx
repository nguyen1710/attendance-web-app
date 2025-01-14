import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2  } from "lucide-react";

// const userData = [
// 	{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
// 	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
// 	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
// 	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
// 	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
// ];

const UsersTable = ({title, userData, numberOfStudents}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [users, setUsers] = useState(userData)
	console.log("Student",userData)
	useEffect(() => {
		setUsers(userData);
	  }, [userData]);
	console.log("sss",users)

	console.log("Studnet",filteredUsers)
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = userData.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	function formatDateTime(isoString) {
		const date = new Date(isoString);
	
		// Lấy các thành phần giờ, phút, ngày, tháng, năm
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
		const year = date.getFullYear();
	
		// Kết hợp thành định dạng hh:mm dd/mm/yyyy
		return `${hours}:${minutes} ${day}/${month}/${year}`;
	}
	return (
		<>
			<div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">{title} List</h3>
                            <p className="text-slate-500">List of {title}: {userData.length}/{numberOfStudents}</p>
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
                            {users ? (
                                users.map((user) => {
                                    return (
                                        <tr key={user.id}>
                                            <td className="p-4 border-b border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
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
                                                    <div className={`relative grid items-center px-2 py-1  uppercase rounded-md select-none whitespace-nowrap`}>
                                                       
													   {title === "Attendees" ? formatDateTime(user.timestamp) : (user.excused ? <span className="text-green-500 font-sans text-xs font-bold ">Vắng có phép</span> : <span className="text-red-500 font-sans text-xs font-bold ">Vắng không phép</span>)}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="p-4 border-b border-slate-200">
                                                <p className="text-sm text-slate-500">{formatDate(user.createdAt)}</p>
                                            </td> */}
                                            <td className="p-4 border-b border-slate-200">
											{title === "Attendees" ? <a>Bằng chứng</a> : <a>Điểm danh</a>}
                                            </td>
                                        </tr>
                                        
                                    );
                                }
                            )
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Loading...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
		
		
		</>
	);
};
export default UsersTable;