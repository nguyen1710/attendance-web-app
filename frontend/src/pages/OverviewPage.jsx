import { BarChart2, ShoppingBag, Users, Zap, UserSquare, DollarSign, DiamondIcon, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaFileExcel } from "react-icons/fa"; // Biểu tượng Excel từ react-icons

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import SalesOverviewChart from "../components/admin/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/admin/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/admin/overview/SalesChannelChart";

const API_URL_BASE = import.meta.env.VITE_API_BASE_URL;

const OverviewPage = () => {
  const [clients, setClients] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [erroMessage, setErrorMessage] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [levelCounts, setLevelCounts] = useState({ Level1: 0, Level2: 0, Level3: 0 });

  useEffect(() => {
    axios
      .get(`${API_URL_BASE}/admin-service/api/admin/getAllClients`)
      .then((response) => {
        setClients(response.data);

        const levelCount = response.data.reduce((acc, client) => {
          if (client.level === "1") acc.Level1++;
          if (client.level === "2") acc.Level2++;
          if (client.level === "3") acc.Level3++;
          return acc;
        }, { Level1: 0, Level2: 0, Level3: 0 });

        setLevelCounts(levelCount);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/admin-service/api/admin/getAllClassrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/admin-service/api/admin/getAllAttendance")
      .then((response) => {
        setAttendance(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  const totalAmount = clients.reduce((sum, item) => sum + item.amountMoney, 0);
  const totalLevel1 = clients.filter(client => client.level === 1).length;
  const totalLevel2 = clients.filter(client => client.level === 2).length;
  const totalLevel3 = clients.filter(client => client.level === 3).length;

  // Hàm xuất file Excel
  const exportToExcel = () => {
    // Tạo một mảng dữ liệu để xuất
    const data = [
      ["Tên", "Email", "Số điện thoại", "Level", "Số tiền", "Địa chỉ"],
      ...clients.map(client => [client.username, client.email, client.phone, client.level, client.amountMoney, client.address])
    ];

    // Tạo một workbook và worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");

    // Xuất file Excel và lưu xuống máy tính
    XLSX.writeFile(wb, "clients_data.xlsx");
  };

  return (
    <div className='flex-1 overflow-auto relative z-10  bg-[#ffffff] bg-opacity-90'>
      <Header title='Overview' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Clients" icon={UserSquare} value={clients.length} color="#6366F1" />
          <StatCard name='Total Classrooms' icon={BarChart2} value={classrooms.length} color='#6366F1' />
          <StatCard name='Revenue' icon={DollarSign} value={totalAmount} color='#6366F1' />
          <StatCard name='Normal' icon={Zap} value={totalLevel1} color='#6366F1' />
          <StatCard name='Premium' icon={DiamondIcon} value={totalLevel2} color='#6366F1' />
          <StatCard name='VIP' icon={Crown} value={totalLevel3} color='#D7942D' />
        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesOverviewChart clients={clients} attendance={attendance} />
          <CategoryDistributionChart clients={clients} attendance={attendance} />
        </div>
      </main>

      {/* Floating Button */}
      <button
        onClick={exportToExcel}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
      >
        <FaFileExcel className="text-2xl" />
      </button>
    </div>
  );
};

export default OverviewPage;