import { BarChart2, ShoppingBag, Users, Zap, UserSquare, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import SalesOverviewChart from "../components/admin/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/admin/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/admin/overview/SalesChannelChart";
const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

const OverviewPage = () => {
	const [clients, setClients] = useState([]);
	const [classrooms, setClassrooms] = useState([]);

	useEffect(() => {
		axios
		.get(`${API_URL_BASE}/admin-service/api/admin/getAllClients`) // Địa chỉ API của bạ
		.then((response) => {
		setClients(response.data);
		})
		.catch((error) => {
		setError(error.message);
		});
	}, []);

	useEffect(() => {
		axios
		.get("http://localhost:4000/admin-service/api/admin/getAllClassrooms") 
		.then((response) => {
		setClassrooms(response.data)
		console.log(response.data);
		})
		.catch((error) => {
		setError(error.message);
		});
	}, []);

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
					<StatCard name='Premeum' icon={Zap} value='1' color='#6366F1' />
					<StatCard name='Revenue' icon={DollarSign} value='123232' color='#6366F1' />
				</motion.div>

				{/* CHARTS */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;