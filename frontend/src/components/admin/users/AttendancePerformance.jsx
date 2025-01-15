import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dữ liệu thống kê người có mặt và vắng mặt
const attendanceData = [
  { name: "Present", value: 2000 }, // Số người có mặt
  { name: "Absent", value: 800 },   // Số người vắng mặt
];

const COLORS = ["#34D399", "#F87171"]; // Màu sắc: xanh cho có mặt, đỏ cho vắng mặt

const AttendancePerformance = () => {
  return (
    <motion.div
      className="bg-[#fff] rounded-xl border-gray-700 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-600">Attendance Statistics</h2>
      
      {/* Biểu đồ tròn cho "Có mặt" và "Vắng mặt" */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={attendanceData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {attendanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      
    </motion.div>
  );
};

export default AttendancePerformance;
