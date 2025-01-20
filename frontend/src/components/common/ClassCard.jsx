/* eslint-disable react/prop-types */
import React from 'react';
import { motion } from "framer-motion";

const ClassCard = ({ classroom }) => {
  return (
    <>
    <motion.div
			className='bg-white backdrop-blur-md overflow-hidden shadow-lg rounded-xl border-gray-900 mb-3'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
      <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img
          src={classroom.ownerAvatar}
          alt={classroom.name}
          className="w-14 h-14 rounded-full border-2 border-green-500"
        />
        <div>
          <h3 className="text-xl font-semibold">{classroom.name}</h3>
          <span className="text-md text-pink-500">{classroom.description}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Owner: <span className="font-medium">{classroom.owner}</span>
      </p>
      {/* <div className="mt-3 text-xs text-gray-500">{classroom.company}</div> */}
    </div>


    </motion.div>


    </>

    
    
  );
};

export default ClassCard;
