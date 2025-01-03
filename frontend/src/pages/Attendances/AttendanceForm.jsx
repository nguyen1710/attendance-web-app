import React, { useEffect, useState } from 'react'
import Logo from "~/public/img/logo.png";
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
function AttendanceForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [className, setClassname] = useState("")
    const [date, setDate] = useState(null)
    const {id} = useParams()
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gửi yêu cầu GET tới API
                const response = await axios.get(`http://localhost:4000/attandence-service/api/attendances/getFormAttend/${id}`);
                if(response.data.success) {
                    console.log(response)
                    setClassname(response.data.data.classroomName)
                    setDate(format(new Date(response.data.data.date), 'eeee, dd/MM/yyyy, HH:mm:ss'))
                
                }
            } catch (error) {
                console.error("Error fetching data:", error); // Bắt lỗi nếu có
            }
        };
    
        fetchData(); // Gọi hàm fetchData khi useEffect chạy
    }, [id]); // Thêm dependency array nếu id có thể thay đổi

    const handleSubmit = async ( e ) => {
        e.preventDefault()

        try {
            const response = await axios.post(`http://localhost:4000/attandence-service/api/attendances/checkFormAttend/${id}`, {email, password})
            console.log(response)

            if (response.data.success) {
                // setSuccessMessage(response.data.message);
                // Optionally, you can store the user data in state or localStorage
                toast.success(response.data.message)
                console.log(response.data.message)
                // navigate('/')
            }
            } catch (error) {
                toast.error(error.response.data.message)
                console.error("Error data data:", error); // Bắt lỗi nếu có

        }
    }
  return (
<div className="mx-auto md:h-screen flex flex-col justify-center items-center">
        <a
            href="#"
            className="text-2xl font-semibold flex justify-center items-center mb-8 lg:mb-10"
        >
            <img src={Logo} className="mr-4 w-20 h-20 mt-3" alt="Windster Logo" />
            <span className="self-center text-2xl font-bold whitespace-nowrap">
            NN Innovation
            </span>
        </a>
        {/* <!-- Card --> */}
        <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0 border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <div className="p-6 sm:p-8 lg:p-16 space-y-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Attendance 

            </h2>

            <h2>
                {className} <br/>
                {date}     
            </h2> 
            <form className="mt-8 space-y-6" action="#">
                <div>
                <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 block mb-2"
                >
                    Your email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="name@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {/* {errors.email && (
                    <p className="text-warning text-sm mt-1">{errors.email}</p>
                )} */}
                </div>

                <div>
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 block mb-2"
                >
                    Your password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* {errors.password && (
                    <p className="text-warning text-sm mt-1">{errors.password}</p>
                )} */}
                </div>
                


                <div className="!mt-8">
                <button
                    type="submit"
                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary-100 hover:bg-blue-700 focus:outline-none"
                    onClick={handleSubmit}
                >
                    Confirm
                </button>
                </div>

            </form>
            </div>
        </div>
        </div>
  )
}

export default AttendanceForm