import { motion } from "framer-motion";
import { BookText } from 'lucide-react';
const ClassCard = ({ name, owner, color, desc }) => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border-gray-900'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium text-gray-400'>
					<BookText size={20} className='mr-2' style={{ color }} />
					{owner}
				</span>
				<p className='mt-1 text-3xl font-semibold text-gray-100'>{name}</p>
				<p className='mt-1  font-semibold text-gray-100'>Description: {desc}</p>
			</div>
		</motion.div>
	);
};
export default ClassCard;