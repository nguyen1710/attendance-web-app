import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import LoginImg from "~/public/img/authLanding.gif";

function adminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL_BASE}/admin-service/api/admin/login`,
        { email, password },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem('imageUrl', response.data.user.imageUrl);
        localStorage.setItem("adminInfo", JSON.stringify(response.data.user));
        // Navigate to the admin dashboard
        navigate("/admin");
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-lg max-md:mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <h3 className="text-gray-800 text-3xl font-extrabold mb-8">
                Admin Login
              </h3>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <input
                  name="email"
                  value={email}
                  type="email"
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  value={password}
                  type="password"
                  required
                  className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full shadow-lg py-3 px-4 text-sm rounded-lg text-black bg-blue-600 hover:bg-blue-700"
              >
                Log in
              </button>
            </form>
          </div>
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <img
              src={LoginImg}
              className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
              alt="Login Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default adminLogin;
