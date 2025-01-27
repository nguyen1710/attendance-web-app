// export default SubmissionTablle;

import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import CreateSubmissionDialog from "~/pages/Dialog/CreateSubmissionDialog";
import SelectedSubmissionDialog from "../../Dialog/SelectedSubmissionDialog";

function SubmissionTablle({ submissionsData , classOwner}) {
    const [submissions, setSubmissions] = useState(submissionsData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null); // Store the selected submission
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

    const closeModal = () => {
        setSelectedSubmission(null)
        setIsModalOpen(false); // Close the modal
    };

    const openModal = (submission) => {
        setSelectedSubmission(submission); // Set the selected submission
        setIsModalOpen(true); // Open the modal
    };

    const {classId} = useParams()

    const closeDialog = () => setIsDialogOpen(false);
    const openDialog = () => setIsDialogOpen(true);
    
    useEffect(() => {
        if (Array.isArray(submissionsData)) {
            // Sắp xếp nếu submissionsData là một mảng
            const sortedSubmissions = [...submissionsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSubmissions(sortedSubmissions);
        } else {
            console.error("submissionsData is not an array:", submissionsData);
        }
    }, [submissionsData]);

    console.log(submissions);

    const truncateContent = (content, maxLength) => {
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + "...";
        }
        return content;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500 bg-opacity-20 text-green-900'; // Màu xanh cho trạng thái Approved
            case 'Rejected':
                return 'bg-red-500 bg-opacity-20 text-red-900'; // Màu đỏ cho trạng thái Rejected
            case 'Pending':
            default:
                return 'bg-yellow-500 bg-opacity-20 text-yellow-900'; // Màu vàng cho trạng thái Pending
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
                
    return (
        <>
            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border">
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Employees List</h3>
                            <p className="text-slate-500">List of submission</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                            <button
                                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                View All
                            </button>
                            <button
                                className="flex select-none items-center gap-2 rounded bg-cyan-600 hover:bg-cyan-700 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                                onClick={openDialog}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    strokeWidth="2"
                                    className="w-4 h-4"
                                >
                                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                                </svg>
                                Add Submission
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-0 overflow-scroll">
                    <table className="w-full mt-4 text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Member
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                            ></path>
                                        </svg>
                                    </p>
                                </th>
                                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Submission
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                            ></path>
                                        </svg>
                                    </p>
                                </th>
                                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Status
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                            ></path>
                                        </svg>
                                    </p>
                                </th>
                                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Created
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                            ></path>
                                        </svg>
                                    </p>
                                </th>
                                <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500"></p>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions ? (
                                submissions.map((submission) => {
                                    return (
                                        <tr key={submission.id}>
                                            <td className="p-4 border-b border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={submission.imageUrl || "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg"}
                                                        alt="John Michael"
                                                        className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
                                                    />
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            {submission.userName}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {submission.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {submission.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {truncateContent(submission.content, 30)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <div className="w-max">
                                                    <div className={`relative grid items-center px-2 py-1 font-sans text-xs font-bold ${getStatusColor(submission.status)} uppercase rounded-md select-none whitespace-nowrap`}>
                                                        <span>{submission.status}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <p className="text-sm text-slate-500">{formatDate(submission.createdAt)}</p>
                                            </td>
                                            <td className="p-4 border-b border-slate-200">
                                                <button
                                                    className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                    type="button"
                                                    onClick={() => openModal(submission)} // Open modal when clicked
                                                >
                                                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            aria-hidden="true"
                                                            className="w-3.5 h-3.5"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M11.146 4.854a.5.5 0 01.708 0l7 7a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708L17.793 12H4.5a.5.5 0 010-1h13.293L11.146 4.854z"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                        
                                    );
                                }
                            )
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">Loading...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between p-3">
            <p className="block text-sm text-slate-500">
            Page 1 of 10
            </p>
            <div className="flex gap-1">
            <button
                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Previous
            </button>
            <button
                className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Next
            </button>
            </div>
        </div>
            </div>
            {selectedSubmission && (
                <SelectedSubmissionDialog
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    submissionId={selectedSubmission._id} // You can pass any other required props
                    title={selectedSubmission.title}
                    content={selectedSubmission.content}
                    fromDate={selectedSubmission.fromDate}
                    toDate={selectedSubmission.toDate}
                    evidence={selectedSubmission.evidence}
                    classOwner={classOwner}
                    status={selectedSubmission.status}
                    refreshData={() => {
                        axios
                          .get(`http://localhost:4000/attendance-service/api/submissions/getSubmissions/${classId}`, {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          })
                          .then((response) => {
                            if (response.data.success) {
                                const sortedSubmissions = [...response.data.submissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                                setSubmissions(sortedSubmissions);
                                setIsModalOpen(false)
                            } else {
                              toast.error(response.data.message);
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                            toast.error(error.response.data.message);
                          });
                      }}
                />
            )}

            <CreateSubmissionDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                classId={classId}
                refreshData={() => {
                    axios
                      .get(`http://localhost:4000/attendance-service/api/submissions/getSubmissions/${classId}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      })
                      .then((response) => {
                        if (response.data.success) {
                            const sortedSubmissions = [...response.data.submissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            setSubmissions(sortedSubmissions);
                            setIsDialogOpen(false)
                        } else {
                          toast.error(response.data.message);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        toast.error(error.response.data.message);
                      });
                  }}
              
                />

                
        </>

        
    );
}

export default SubmissionTablle;
