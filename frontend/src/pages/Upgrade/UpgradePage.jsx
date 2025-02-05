/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "~/components/common/Header";
import PaymentDialog from "./PaymentDialog";
import axios from "axios"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function UpgradePage() {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL
  // console.log(id)

  const handleUpgade = async (amount, orderInfo) => {
    try {
      const response = await axios.post(`${API_URL_BASE}/user-service/api/upgrade/payment`, {amount, orderInfo})
      if (response.data.success) {
        // setSuccessMessage(response.data.message);
        // Optionally, you can store the user data in state or localStorage
        toast.success("Please redirect to paying page")
        // navigate()
        window.location.href = response.data.result.payUrl;
      }
    } catch (error) {
        // setErrorMessage(error.response.data.message);
        console.log(error)
        
    }
  }
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header username={username} email={email} title={"Upgrade version"} />
        {/* <TabclassNameRoom classId={classId} currentTab={'submission'}/> */}

        <main className="max-width mx-auto py-6 px-4 lg:px-8">
          <div className="flex justify-end">
            {/* <button
            type="button"
            onClick={openDialog}
            classNameName="flex items-center text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <CirclePlus classNameName="w-5 h-5 mr-2" />
            Add Student
          </button> */}
          </div>
          {/* <AddStudentDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          id={classNameId}

        /> */}
          <div className="grid grid-cols-1 space-y-12 md:space-y-0 md:grid-cols-2 lg:grid-cols-3 md:gap-x-6 md:gap-6 pt-9">
            <div className="flex flex-col max-w-lg p-6 mx-auto text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                Best option for personal use.
              </p>
              <div className="flex items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$Free</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    Check attendance directly by{" "}
                    <span className="font-semibold"> check </span> and{" "}
                    <span className="font-semibold">QR code</span>.
                  </span>
                </li>
              </ul>
            </div>

            {/* <!-- Pricing Card --> */}
            <div className="flex flex-col max-w-lg p-6 mx-auto text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 className="mb-4 text-2xl font-semibold">Company</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                Best for large scale uses and extended redistribution rights.{" "}
              </p>
              <div className="flex items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$1</span>
                <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">
                  /month
                </span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>

                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Includes all the functions of the free version</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>

                  <span>
                    Check attendance by{" "}
                    <span className="font-semibold"> ID card </span> and{" "}
                    <span className="font-semibold">Fingerprint</span>.
                  </span>
                </li>
              </ul>
              <a
                onClick={() => {
                  handleUpgade(1000, `${email} upgrade account to level 2`)
                }}
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-cyan-900"
              >
                Get started
              </a>
            </div>

            {/* <!-- Pricing Card --> */}
            <div className="flex flex-col max-w-lg p-6 mx-auto text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                Relevant for multiple users, extended & premium support.
              </p>
              <div className="flex items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$2</span>
                <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400">
                  /month
                </span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>

                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Includes all the functions of the free version</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>

                  <span>
                    Check attendance by{" "}
                    <span className="font-semibold"> ID card </span> and{" "}
                    <span className="font-semibold">Fingerprint</span>.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* <!-- Icon --> */}
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>

                  <span>
                    Check attendance by{" "}
                    <span className="font-semibold"> Face Recognition</span>.
                  </span>
                </li>
              </ul>
              <a
                onClick={() => {
                  handleUpgade(2000, `${email} upgrade account to level 3`)
                }}
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-cyan-900"
              >
                Get started
              </a>
            </div>
          </div>
        </main>
      </div>

      {/* <PaymentDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        amount={amount}
        info={info}
      /> */}
    </>
  );
}

export default UpgradePage;
