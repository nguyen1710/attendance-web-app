import { useState } from 'react';

function TabClassRoom({ classId, currentTab }) {
  const [activeTab, setActiveTab] = useState(currentTab); // Khởi tạo tab mặc định là 'attendance'

  // Hàm xử lý khi người dùng nhấp vào tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 bg-white">
      <div className="flex justify-center">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              href={`/classroom/${classId}`}
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg 
                ${activeTab === 'attendance' ? 'text-blue-600 border-blue-600' : 'hover:bg-gray-200 hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-blue-500'}`}
              onClick={() => handleTabClick('attendance')}
            >
              Attendance
            </a>
          </li>
          <li className="me-2">
            <a
              href={`/classroom/${classId}/users`}
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg 
                ${activeTab === 'user' ? 'text-blue-600 border-blue-600' : 'hover:bg-gray-200 hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-blue-500'}`}
              onClick={() => handleTabClick('user')}
            >
              User
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg 
                ${activeTab === 'request' ? 'text-blue-600 border-blue-600' : 'hover:bg-gray-200 hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-blue-500'}`}
              onClick={() => handleTabClick('request')}
            >
              Request
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TabClassRoom;
