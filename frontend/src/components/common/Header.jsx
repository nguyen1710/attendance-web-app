// export default Header;
import { Bell, User, Settings, LogOut, Gem } from "lucide-react";
import { useEffect, useState, useRef } from "react";
// import {io} from "socket.io-client"
import socket from "~/socketio/socket.js";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "~/public/img/logo.png"


const Header = ({ title }) => {
  const navigate = useNavigate()
  const [hasNotification, setHasNotification] = useState(true);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username] = useState(localStorage.getItem("username") || "Guest");
  const [email] = useState(
    localStorage.getItem("email") || "guest@example.com"
  );
  const [imageUrl] = useState(
    localStorage.getItem("imageUrl") || "https://via.placeholder.com/150"
  );
  const [notifications, setNotifications] = useState([]);

  const notiRef = useRef(null); // Tạo ref cho vùng thông báo
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL


  // Lắng nghe sự kiện "notification" từ server
  useEffect(() => {
    socket.on("notification", (data) => {
      // Thêm thông báo mới vào mảng notifications
      setNotifications((prevNotifications) => [
        {
          _id: data._id,
          sender: data.sender,
          title: data.title,
          classId: data.classId,
          className: data.className,
          status: "Unread", // Mặc định là chưa đọc
          isResponse: data.isResponse,
        },
        ...prevNotifications,
      ]);
      setHasNotification(true);
    });
    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      socket.off("notification");
    };
  }, []);

  // Xử lý sự kiện click ngoài thành phần thông báo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setIsNotiOpen(false); // Đóng menu thông báo
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  socket.on("notification", (data) => {
    console.log(data);
  });
  const handleMarkAsRead = async (notiId) => {
    event.preventDefault(); // Ngăn chuyển trang ngay lập tức

    console.log(notiId);
    setNotifications((prevNotis) =>
      prevNotis.map((noti) =>
        noti._id === notiId ? { ...noti, status: "Read" } : noti
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL_BASE}/attendance-service/api/submissions/getNotification`,
        { notiId }, // Gửi notiId để cập nhật trạng thái
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Nếu có token, thực hiện yêu cầu lấy thông tin lớp học
    axios
      .get(
        `${API_URL_BASE}/attendance-service/api/submissions/getNotification`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          const sortedNoti = response.data.notifications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setNotifications(sortedNoti);
        } else {
          console.log(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    // Gửi yêu cầu logout đến backend
    axios
      .post(`${API_URL_BASE}/user-service/api/auth/logout`, {}, {
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
          socket.disconnect()
          // Chuyển hướng về trang login
          navigate('/login');
        } else {
          // Xử lý nếu có lỗi
          toast.success(response.data.message)
        }
      })
      .catch((error) => {
        console.log('Logout error:', error);
        alert('Error logging out');
      });
  };

  return (
    <header className="w-full bg-white text-black z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center h-16">
          {/* <h1 className="text-2xl font-semibold text-black"> NN Attendance </h1> */}
          <h2 className="text-2xl font-semibold text-black">{title} </h2>
        </div>
        

        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200 relative"
              aria-label="Notifications"
              onClick={() => {
                setIsNotiOpen((prev) => !prev);
                setHasNotification(false); // Clear notifications
              }}
            >
              <Bell className="h-4 w-4 text-gray-600" />
              {hasNotification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotiOpen && (
              <div
                className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-lg divide-y divide-gray-100 z-50"
                aria-labelledby="dropdownNotificationButton"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 font-semibold text-gray-700 bg-gray-50 rounded-t-lg">
                  Notifications
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.slice(0, 7).map((noti) => (
                    <a
                      key={noti._id}
                      onClick={async (event) => {
                        event.preventDefault(); // Ngăn chuyển trang ngay lập tức
                        await handleMarkAsRead(noti._id); // Gọi API
                        // Chuyển hướng sau khi cập nhật
                        window.location.href = `http://localhost:5173/classroom/${noti.classId}/submission`;
                      }}
                      className={`flex cursor-pointer items-center px-4 cursor py-3 ${
                        noti.status === "Unread"
                          ? "bg-gray-200 hover:bg-gray-300"
                          : "hover:bg-gray-100"
                      } transition duration-200`}
                    >
                      <img
                        className="w-11 h-11 rounded-full flex-shrink-0"
                        src="https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                        alt={`${noti.receiver}'s profile`}
                      />
                      {noti.isResponse ? (
                        <div className="ml-3 w-full">
                          <div className="text-sm text-gray-500">
                            User{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.sender}
                            </span>{" "}
                            has responsed your{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.title}
                            </span>{" "}
                            at class{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.className}
                            </span>{" "}
                          </div>
                        </div>
                      ) : (
                        <div className="ml-3 w-full">
                          <div className="text-sm text-gray-500">
                            User{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.sender}
                            </span>{" "}
                            has applied{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.title}
                            </span>{" "}
                            to class{" "}
                            <span className="font-semibold text-gray-900">
                              {noti.className}
                            </span>{" "}
                          </div>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
                {notifications.length === 0 ? null : (
                  <div className="w-full hover:underline cursor-pointer px-4 py-2 font-semibold text-gray-700 bg-gray-50 rounded-t-lg rounded-b-lg ">
                    <a href="/notifications">View all</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <img
              src={imageUrl.replace(/"/g, "")}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover border border-gray-300 cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md text-sm z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="font-medium">{username}</p>
                    <p className="text-gray-500 truncate max-w-[120px]">
                      {email}
                    </p>
                  </div>
                </div>
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <a href="/profile" className="flex gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      My Profile
                    </a>
                    
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-600" />
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" >
                    <a className="flex gap-2" href="/upgrade">
                      <Gem className="h-4 w-4 text-gray-600 " />
                      Upgrade
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    Status
                  </li>
                </ul>
                <div className="py-2 border-t">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center"
                    onClick={handleLogout} // Replace with logout logic
                  >
                    <LogOut className="h-4 w-4 text-red-600 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
