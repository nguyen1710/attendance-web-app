import { motion } from "framer-motion";
import { BookText } from 'lucide-react';
const ClassCard = ({ name, owner, color, desc, method }) => {
	return (
		<motion.div
			className='bg-white backdrop-blur-md overflow-hidden shadow-lg rounded-xl border-gray-900 mb-3'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6 text-black'>
				<span className='flex items-center text-sm font-medium '>
					<BookText size={20} className='mr-2' style={{ color }} />
					{owner}
				</span>
				<p className='mt-1 text-3xl font-semibold text-black'>{name}</p>
				<p className='mt-1  font-semi text-black'>Description: {desc}</p>
				<p className='mt-1  font-semi text-black'>Method: {method ? method : "Normal"}</p>

			</div>
		</motion.div>
	);
};
export default ClassCard;