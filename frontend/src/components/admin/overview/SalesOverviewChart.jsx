import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const SalesOverviewChart = ({ attendance }) => {
  // Chuyển đổi dữ liệu thành dạng phù hợp
  const formattedData = attendance.map(item => ({
    date: new Date(item.date).toLocaleDateString(), // Chuyển đổi ngày thành định dạng dễ đọc
    attendees: item.attendees.length, // Số lượng người tham dự
    nonAttendees: item.nonAttendees.length, // Số lượng người không tham dự
  }));

  return (
    <motion.div
      className='bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-700'>Attendance Trend</h2>

      <div className='h-80'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey="date" stroke='#9ca3af' />
            <YAxis stroke='#9ca3af' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='attendees'
              name='Attendees'
              stroke='#34D399'
              strokeWidth={3}
              dot={{ fill: "#34D399", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
            <Line
              type='monotone'
              dataKey='nonAttendees'
              name='Non-Attendees'
              stroke='#EF4444'
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;