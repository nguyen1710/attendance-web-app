import React, { useState } from 'react'

function PaymentDialog({ isOpen, onClose, amount, info }) {
  if (!isOpen) return null;
  

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg 2xl:w-[40%] xl:w-[50%] lg:w-[70%] md:w-[80%] sm:w-[80%] h-auto ">
      <h2 className="text-[25px] justify-self-center font-semibold mb-4">Please pay with the QR code below </h2>
        <div className='flex flex-col justify-items-center mt-4'>
          <img
            src={`https://qr.sepay.vn/img?acc=VQRQABHQT3470&bank=MBBank&amount=${amount}&des=${info}&template=compact` }
            className="h-[600px] w-auto object-contain rounded-md" // Định dạng kích thước
            >
          </img>

             
        </div>

        <div className='flex justify-center mt-10'>
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