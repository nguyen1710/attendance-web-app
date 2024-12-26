import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "~/public/img/logo.png";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const [timeLeft, setTimeLeft] = useState(60); // 60 giây
  const [code, setCode] = useState();
  const [errorsMessage, setErrorsMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email ) {
        // Nếu không có token hoặc thông tin người dùng, chuyển hướng về trang đăng nhập
        navigate('/login');
    } else {
      setEmail(JSON.parse(email));
    }
  }, [navigate]);

  useEffect(() => {
    const storedTime = localStorage.getItem("timeLeft");
    if (storedTime) {
      setTimeLeft(parseInt(storedTime, 10)); // Nếu có thì tiếp tục từ giá trị lưu
    }
    
    if (timeLeft === 0) return; // Khi hết giờ, dừng bộ đếm
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem("timeLeft", newTime); // Lưu giá trị mới vào localStorage
        return newTime;
      })
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp bộ đếm khi component bị unmount
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (code.length < 6) {toast.error("Verification code must have 6 digits")}
      const response = await axios.post(
        "http://localhost:4000/user-service/api/auth/verify-email",
        { code }
      );
      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/");
      }
    } catch (error) {
      setErrorsMessage(error.response.data.message)
      // console.log(errorsMessage);
      toast.error(error.response.data.message)
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:4000/user-service/api/auth/resend-verification",{ email })
      setTimeLeft(60);
      localStorage.setItem("timeLeft", 60)
      if(response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
      setErrorsMessage(error.response.data.message)
      console.log(errorsMessage);
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
            Verify Email
          </h2>
          <form className="mt-8 space-y-6" action="#" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Verify code
              </label>
              <input
                type="code"
                name="code"
                id="code"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="Verify Code"
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary-100 hover:bg-blue-700 focus:outline-none"
              >
                Verify
              </button>
            </div>

            <div className="flex justify-center items-center flex-col">
              <p className="text-sm mt-1">
                This code will expire in{" "}
                {formatTime(timeLeft)}{" "}
              </p>

              {timeLeft === 0 ? <button
                href="#"
                className="w-30 shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary-100 hover:bg-blue-700 focus:outline-none mt-3"
                onClick = {handleResendOTP}
              >
                Resend OTP
              </button> : null}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
