import React, {useState, useEffect} from 'react';
import AttendanceTable from "../../admin/users/AttendanceTable";
import axios from "axios";
import {MoreVertical, Edit2} from "lucide-react";
import AttendacePerformance from "./AttendancePerformance";
import toast from "react-hot-toast";
import EditModal from "./EditModal";


const UserDetailsPage = ({ selectedUser, handleBackClick }) => {
  const [clients, setClients] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleContent, setVisibleContent] = useState({});
  const [visibleMenu, setVisibleMenu] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL

  const toggleContent = (clientId) => {
    setVisibleContent((prevState) => ({
      ...prevState,
      [clientId]: !prevState[clientId],
    }));
  };

  useEffect(() => {
		console.log(selectedUser);
    axios
      .post(`${API_URL_BASE}/admin-service/api/admin/getAttendanceByClassroomId`, { classId: selectedUser._id }) 
      .then((response) => {
        setClients(response.data); 
        console.log(response.data);
        console.log(response.data.attendees);
      })
      .catch((err) => {
      });
	  }, []);

  const handleMenuToggle = (clientId, e) => {
    e.stopPropagation(); // Ngăn không mở nội dung khi bấm vào MoreVertical
    setVisibleMenu((prev) => (prev === clientId ? null : clientId));
  };

  const closeMenu = () => {
    setVisibleMenu(null);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleEditClick = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setClientToEdit(null); 
    setIsModalOpen(false); 
  };

  const handleSaveChanges = (updatedClient) => {
    axios
      .put(`${API_URL_BASE}/admin-service/api/admin/updateAttendance`, updatedClient)
      .then((response) => {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client._id === updatedClient._id ? updatedClient : client
          )
        );
        setIsModalOpen(false);
        toast.success('Client updated successfully!');

        setTimeout(() => {
          window.location.reload();
        }, 3000); 

      })
      .catch((err) => {
        console.error('Error updating client:', err);
      });
  };
  


  const handleDeleteClick = async (client) => {
    if (!window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      return;
    }
  
    try {
      await axios.delete(`${API_URL_BASE}/admin-service/api/admin/deleteAttendance`, {
        data: { attendanceId: client._id } 
      }).then((response) => {
        toast.success(response.data.message);
      });
      
      setClients((prevClients) => prevClients.filter((c) => c._id !== client._id));
  
      console.log(`Deleted client: ${client._id}`);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };
  

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log("Selected Date:", event.target.value);
    // Add logic to filter the attendance grid based on the selected date
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = date.getFullYear();
  // ${hours}:${minutes}:${seconds} 
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          className="flex items-center text-gray-500 hover:text-gray-700 font-semibold"
          onClick={handleBackClick}
        >
          ← Back 
        </button>
        {/* <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Edit Project
        </button> */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 text-gray-600">

        <div className="w-full">
          {/* Description */}
          <div className="bg-white shadow rounded-lg mb-6 p-4">
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
            <p className="text-gray-600 mt-2">
              {selectedUser.description}
            </p>
          </div>
          {clients.map((client) => (
            <div key={client._id}>
              <div
                className="flex justify-between items-center bg-white rounded-md p-4 text-gray-600 cursor-pointer mt-6"
                onClick={() => toggleContent(client._id)} // Pass the clientId to toggle
              >
                <p className="text-lg font-semibold">
                {visibleContent[client._id] ? "⏷" : "⏵"}
                </p>
                <p className="text-lg font-semibold">{client.name}</p>
                <div className="text-xs text-gray-400 flex relative">
                  {formatDate(client.date)} 
                  <MoreVertical className="ml-2" size={16} onClick={(e) => handleMenuToggle(client._id, e)}/>

                  {visibleMenu === client._id && (
                    <div className=" absolute top-0 right-0 bg-white shadow-lg rounded-md border w-28 p-2 z-50">
                      <button
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 font-semibold"
                        onClick={() => handleEditClick(client)}
                      >
                        Edit
                      </button>

                      
                      <button
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 font-semibold"
                        onClick={() => handleDeleteClick(client)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {clientToEdit && (
                <EditModal
                  client={clientToEdit}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onCancel={handleCancelEdit}
                  onSave={handleSaveChanges}
                />
              )}    

              {visibleContent[client._id] && (

                
                <div className="flex flex-col mb-6 bg-[#fff] p-6">

                  <AttendacePerformance client={client}/>

                  <div className="flex justify-between items-center bg-white mb-6 font-semibold text-gray-600">
                    <h2 className="text-lg font-semibold">Attendance Grid</h2>
                    <div className="flex space-x-4">
                      {/* Status filter
                      <select
                        className="border border-gray-300 rounded-md p-2 text-sm"
                        onChange={(e) => handleStatusChange(e.target.value)} // Handle status change
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select> */}
                      
                      {/* Sorting filter */}
                      {/* <select
                        className="border border-gray-300 rounded-md p-2 text-sm"
                        onChange={(e) => handleSortChange(e.target.value)} // Handle sorting change
                      >
                        <option value="">Sort by: Name</option>
                        <option value="A → Z">A ⮁ Z</option>
                        <option value="Z → A">Z ⮃ A</option>
                      </select> */}
                      
                      {/* Date picker */}
                      {/* <input
                        type="date"
                        className="border border-gray-300 rounded-md p-2 text-sm"
                        value={selectedDate}
                        onChange={handleDateChange} // Handle date change
                      /> */}
                    </div>
                  </div>

                  {/* Pagination and Search */}
                  <div className="flex items-center justify-between mb-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="rowsPerPage" className="text-sm font-medium">
                        Rows Per Page
                      </label>
                      <select
                        id="rowsPerPage"
                        className="border rounded-md px-2 py-1 text-sm"
                        onChange={(e) => handleRowsPerPageChange(e.target.value)} // Handle rows per page change
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <span className="text-sm">Entries</span>
                    </div>

                    {/* Search input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="border rounded-md px-4 py-1 text-sm"
                        onChange={(e) => handleSearchChange(e.target.value)} // Handle search change
                      />
                    </div>
                  </div>

                  {/* Attendance table */}
                  <AttendanceTable
                    client={client}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    className="mb-6"
                  />
                </div>
              )}

            </div>
          ))}

        

          <div className="bg-white shadow rounded-lg p-4 mb-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Teachers</h3>
            <div className="flex gap-3 flex-wrap mb-6">
              <div className="flex flex-col gap-2">
                {selectedUser.teacherEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* <img
                      src="/path/to/avatar.jpg"
                      alt={`Avatar of ${email}`}
                      className="w-8 h-8 rounded-full"
                    /> */}
                    {email}
                  </div>
                  
                ))}

                {/* <button className="flex items-center text-blue-500 border border-blue-500 rounded px-2 py-1 hover:bg-blue-100">
                  + Add New
                </button> */}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Classmates</h3>
            <div className="flex gap-3 flex-wrap mb-6">
              <div className="flex flex-col gap-2">
                {selectedUser.studentEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {/* <img
                      src="/path/to/avatar.jpg"
                      alt={`Avatar of ${email}`}
                      className="w-8 h-8 rounded-full"
                    /> */}
                    {email}
                  </div>
                  
                ))}

                {/* <button className="flex items-center text-blue-500 border border-blue-500 rounded px-2 py-1 hover:bg-blue-100">
                  + Add New
                </button> */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
