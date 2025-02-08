import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "~/public/img/logo.png";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


function SendEmail() {

    const API_URL_BASE = import.meta.env.VITE_API_BASE_URL;

const [email, setEmail] = useState();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${API_URL_BASE}/user-service/api/auth/sendResetMail`,
      { email }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await Swal.fire({
        title: "An email has been sended!",
        text: "Please check the email.",
        icon: "success",
      });
    }
  } catch (error) {
    console.log(error.response.data);
  }
};
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
            Enter Email
          </h2>
          <form className="mt-8 space-y-6" action="#" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SendEmail;
