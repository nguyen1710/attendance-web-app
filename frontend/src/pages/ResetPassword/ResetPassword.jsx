import React, { useEffect, useState } from "react";
import Logo from "~/public/img/logo.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({})
    const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();
    const {token} = useParams()
    const validation = () => {
        const newErrors = {};

            // Validation
            if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
            if (password !== confirmPassword)
                newErrors.confirmPassword = "Passwords do not match.";
            setErrors(newErrors);

            return Object.keys(newErrors).length === 0 ? true : false
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const isValid = validation()

            if(isValid) {
                const response = await axios.post(`${API_URL_BASE}/user-service/api/auth/resetPassword/${token}`, {password})
                if(response.data.success) {
                    toast.success(response.data.message);
                          await Swal.fire({
                            title: "Successfully!",
                            text: "Please login new password.",
                            icon: "success",
                          });
                    navigate('/login')
                }
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
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
                Enter new password
            </h2>
            <form className="mt-8 space-y-6" action="#">

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
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                </div>
                <div>
                <label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-gray-900 block mb-2"
                >
                    Confirm password
                </label>
                <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                </p>)}
                </div>
                <div className="!mt-8">
                <button
                    type="submit"
                    className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
                    onClick={handleSubmit}
                >
                    Confirm
                </button>
                </div>
                <div className="text-sm font-medium text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-teal-500 hover:underline">
                    Login here
                </a>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
    }

export default ResetPassword;
