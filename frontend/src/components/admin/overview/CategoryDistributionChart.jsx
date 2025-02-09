import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CategoryDistributionChart = ({ attendance }) => {
    // Tính tổng số người tham gia và không tham gia
    const totalAttendees = attendance.reduce((sum, item) => sum + item.attendees.length, 0);
    const totalNonAttendees = attendance.reduce((sum, item) => sum + item.nonAttendees.length, 0);
	console.log(totalNonAttendees)

    // Dữ liệu cho biểu đồ tròn
    const pieChartData = [
        { name: 'Attended', value: totalAttendees },
        { name: 'Absent', value: totalNonAttendees },
    ];

    // Màu sắc cho các phần của biểu đồ
    const COLORS = ['#4CAF50', '#F44336'];

    return (
        <motion.div
            className='bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-lg font-medium mb-4 text-gray-700'>Attendance Distribution</h2>
            <div className='h-80 flex justify-center'>
                <ResponsiveContainer width={'60%'} height={'100%'}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx='50%'
                            cy='50%'
                            innerRadius={60}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                            label // Hiển thị nhãn trên biểu đồ
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4B5563' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            formatter={(value, name, props) => {
                                const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `${percentage}%`;
                            }}
                        />
                        <Legend
                            wrapperStyle={{ color: '#E5E7EB' }} // Màu chữ của chú thích
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CategoryDistributionChart;