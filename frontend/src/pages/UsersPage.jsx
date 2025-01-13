import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

// import UsersTable from "../components/common/UsersTable";	
import UserGrowthChart from "../components/admin/users/UserGrowthChart";
import UserActivityHeatmap from "../components/admin/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/admin/users/UserDemographicsChart";
import UserCard from "../components/admin/users/UserCard";

const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const users = [
	{
	  name: 'Michael Walker',
	  role: 'CEO',
	  project: 'Office Management App',
	  avatar: 'https://via.placeholder.com/150',
	  team: [
		{ name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		{ name: 'Bob', avatar: 'https://via.placeholder.com/50' },
	  ],
	  extraTeamCount: 1,
	  progress: 60,
	  company: 'BrightWave Innovations',
	},
	{
	  name: 'Sophie Headrick',
	  role: 'Manager',
	  project: 'Clinic Management',
	  avatar: 'https://via.placeholder.com/150',
	  team: [
		{ name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		{ name: 'Bob', avatar: 'https://via.placeholder.com/50' },
	  ],
	  extraTeamCount: 2,
	  progress: 40,
	  company: 'Stellar Dynamics',
	},
	{
		name: 'Sophie Headrick',
		role: 'Manager',
		project: 'Clinic Management',
		avatar: 'https://via.placeholder.com/150',
		team: [
		  { name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		  { name: 'Bob', avatar: 'https://via.placeholder.com/50' },
		],
		extraTeamCount: 2,
		progress: 40,
		company: 'Stellar Dynamics',
	  },
	  {
		name: 'Sophie Headrick',
		role: 'Manager',
		project: 'Clinic Management',
		avatar: 'https://via.placeholder.com/150',
		team: [
		  { name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		  { name: 'Bob', avatar: 'https://via.placeholder.com/50' },
		],
		extraTeamCount: 2,
		progress: 40,
		company: 'Stellar Dynamics',
	  },
	  {
		name: 'Sophie Headrick',
		role: 'Manager',
		project: 'Clinic Management',
		avatar: 'https://via.placeholder.com/150',
		team: [
		  { name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		  { name: 'Bob', avatar: 'https://via.placeholder.com/50' },
		],
		extraTeamCount: 2,
		progress: 40,
		company: 'Stellar Dynamics',
	  },
	  {
		name: 'Sophie Headrick',
		role: 'Manager',
		project: 'Clinic Management',
		avatar: 'https://via.placeholder.com/150',
		team: [
		  { name: 'Alice', avatar: 'https://via.placeholder.com/50' },
		  { name: 'Bob', avatar: 'https://via.placeholder.com/50' },
		],
		extraTeamCount: 2,
		progress: 40,
		company: 'Stellar Dynamics',
	  },
	// Add more users here
  ];
  const UsersPage = () => {
	return (
		<div className='flex-1 overflow-auto bg-[#ffffff] bg-opacity-90 relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
					name='Total Users'
					icon={UsersIcon}
					value={userStats.totalUsers.toLocaleString()}
					color='#6366F1'
					/>
					<StatCard
					name='New Users'
					icon={UserPlus}
					value={userStats.newUsersToday}
					color='#6366F1'
					/>
					<StatCard
					name='Active Users'
					icon={UserCheck}
					value={userStats.activeUsers.toLocaleString()}
					color='#6366F1'
					/>
					<StatCard
					name='Inactive Users'
					icon={UserX}
					value={userStats.churnRate}
					color='#6366F1'
					/>
				</motion.div>

				{/* CLIENT GRID */}
				<div className="flex justify-between items-center bg-white shadow-sm rounded-md p-4 mb-6 font-semibold text-gray-600">
					<h2 className="text-lg font-semibold">Client Grid</h2>
					<div className="flex space-x-4">
						<select className="border border-gray-300 rounded-md p-2 text-sm">
							<option>Select Status</option>
							<option>Active</option>
							<option>Inactive</option>
						</select>
						<select className="border border-gray-300 rounded-md p-2 text-sm">
							<option>Sort By: Last 7 Days</option>
							<option>Sort By: Last 30 Days</option>
							<option>Sort By: All Time</option>
						</select>
					</div>
				</div>

				{/* USER CARDS */}
				<div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{users.map((user, index) => (
					<UserCard key={index} user={user} />
					))}
				</div>
			</main>

		</div>
	);
};
export default UsersPage;