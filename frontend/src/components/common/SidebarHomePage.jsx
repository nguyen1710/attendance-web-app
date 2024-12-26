import { BarChart2, DollarSign, Menu,House , Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SidebarHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    // Gửi yêu cầu logout đến backend
    axios
      .post('http://localhost:4000/user-service/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        }
      })
      .then((response) => {
        // Xử lý đăng xuất thành công
        if (response.data.success) {
          // Xóa token khỏi localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          toast.success(response.data.message)
          // Chuyển hướng về trang login
          navigate('/login');
        } else {
          // Xử lý nếu có lỗi
          toast.success(response.data.message)
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
        alert('Error logging out');
      });
  };

  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // Get the current location (route)
  const SIDEBAR_ITEMS = [
    { name: "Home", icon: House, color: "#6366f1", href: `/` },
    { name: "Attendence", icon: BarChart2, color: "#6366f1", href: `/classroom/${id}` },
    { name: "Users", icon: Users, color: "#6366f1", href: `/classroom/${id}/users` },
    { name: "Log out", icon: LogOut, color: "#6366f1", href: "/#", onClick: handleLogout },
  
  ];

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-3 flex flex-col ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            item.name === "Log out" ? ( // Xử lý riêng cho nút Logout
              <motion.div
                key={item.name}
                className="flex items-center p-4 text-sm font-medium hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                onClick={item.onClick} // Gọi hàm logout khi nhấn
              >
                <item.icon
                  size={20}
                  style={{
                    color: "#6366f1", // Màu cho logout
                    minWidth: "20px",
                  }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-4 text-sm font-medium hover:bg-gray-700 transition-colors mb-2 ${
                  location.pathname === item.href
                    ? "font-bold border-r-4 border-[#6366f1] text-gray-100"
                    : "text-gray-400"
                }`}
                whileHover={{ backgroundColor: '#d1d5db' }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: '#d1d5db', 
                }}
              >
                <item.icon
                  size={20}
                  style={{
                    color: location.pathname === item.href ? "#6366f1" : item.color,
                    minWidth: "20px",
                  }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            )
            
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default SidebarHomePage;
