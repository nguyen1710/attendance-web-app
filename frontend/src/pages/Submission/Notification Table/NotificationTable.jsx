// export default SubmissionTablle;

import axios from "axios";
import { useEffect } from "react";
function NotificationTable({ notificationsData }) {
  const [notifications, setNotifications] = useState(notificationsData);
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

  // Lắng nghe sự kiện "notification" từ server
  useEffect(() => {
    // Sắp xếp nếu notificationsData là một mảng
    setNotifications(notificationsData);
  }, [notificationsData]);

  const handleMarkAsRead = async (notiId) => {
    event.preventDefault(); // Ngăn chuyển trang ngay lập tức

    console.log(notiId)
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
      )

    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Notifications
              </h3>
              <p className="text-slate-500">List of notifications</p>
            </div>
          </div>
        </div>
        <div className="p-0 overflow-scroll">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                  <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                    Notification
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
              </tr>
            </thead>

            <tbody>
              {notifications ? (
                notifications.map((noti) => {
                  return (
                    <tr 
                    key={noti.id}
                    onClick={async (event) => {
                        event.preventDefault(); // Ngăn chuyển trang ngay lập tức
                        await handleMarkAsRead(noti._id); // Gọi API
                        // Chuyển hướng sau khi cập nhật
                        window.location.href = `http://localhost:5173/classroom/${noti.classId}/submission`;
                      }}>
                      <td
                        className={`p-4 border-b border-slate-200 ${
                          noti.status === "Unread"
                            ? "bg-gray-200 hover:bg-gray-300"
                            : "hover:bg-gray-100"
                        } cursor-pointer`}
                      >
                        <div className="flex items-center gap-3 ">
                          <img
                            src={
                              "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"
                            }
                            alt={noti.sender}
                            className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                          />
                          <div className="flex flex-col">
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
                          </div>

                          {/* <div className="ml-3 w-full">
                          <div className="text-sm text-gray-500">
                            User {" "}<span className="font-semibold text-gray-900">
                              {noti.sender}
                            </span>{" "} has responsed your
                            {" "}<span className="font-semibold text-gray-900">
                              {noti.title}
                            </span>{" "} at class 
                            {" "}<span className="font-semibold text-gray-900">
                              {noti.className}
                            </span>{" "}
                          </div>
                        </div>) : (
                          <div className="ml-3 w-full">
                          <div className="text-sm text-gray-500">
                            User {" "}<span className="font-semibold text-gray-900">
                              {noti.sender}
                            </span>{" "} has applied
                            {" "}<span className="font-semibold text-gray-900">
                              {noti.title}
                            </span>{" "} to class 
                            {" "}<span className="font-semibold text-gray-900">
                              {noti.className}
                            </span>{" "}
                          </div>
                        </div> */}
                        </div>
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
        <div className="flex items-center justify-between p-3">
          <p className="block text-sm text-slate-500">Page 1 of 10</p>
          <div className="flex gap-1">
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationTable;
