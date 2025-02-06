import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React, { useState, useEffect } from "react";

const COLORS = ["#34D399", "#F87171"];

const AttendancePerformance = ({ client }) => {
  const [allParticipants, setAllParticipants] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (client) {
      const attendees = client.attendees || [];
      const nonAttendees = client.nonAttendees || [];

      const participants = [
        ...attendees.map((emailObj) => {
          const email = Object.values(emailObj).slice(0, -2).join('') || emailObj.email;
          return { email, status: "Present" };
        }),
        ...nonAttendees.map((emailObj) => {
          const email = Object.values(emailObj).slice(0, -2).join('') || emailObj.email;
          return { email, status: "Absent" };
        }),
      ];

      setAllParticipants(participants);
      setAttendanceData([
        { name: "Present", value: attendees.length },
        { name: "Absent", value: nonAttendees.length },
      ]);
    }
  }, [client]);

  return (
    <motion.div
      className="bg-[#fff] rounded-xl border-gray-700 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-gray-600">Attendance Statistics</h2>

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
