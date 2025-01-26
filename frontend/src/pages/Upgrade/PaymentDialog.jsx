import React, { useState } from 'react'

function PaymentDialog({ isOpen, onClose, amount, info }) {
  const accounName = "NGUYEN THANH NGUYEN"
  if (!isOpen) return null;
  

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[50%] h-[80%]">
      <h2 className="text-[25px] justify-self-center font-semibold mb-4">Please pay with the qr code below </h2>
        <div className='flex flex-col justify-items-center mt-4'>
          <img
            src={`https://api.vietqr.io/image/970422-00301020304-dcwY6CU.jpg?amount=${amount}&addInfo=$${info}&accountName=${accounName}` }
            className="h-[600px] w-auto object-contain rounded-md" // Định dạng kích thước
            >
          </img>

             
        </div>

        <div className='flex justify-end'>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 bg-gray-200 hover:bg-warning focus:ring-4 focus:ring-gray-300  hover:text-white font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Cancel
        </button>
        </div>
    </div>
    </div>
    </>
  )
}

export default PaymentDialog