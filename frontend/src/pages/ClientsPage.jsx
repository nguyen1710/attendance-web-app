import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import EditClientForm from "../components/admin/clients/EditClientForm";
import ClientTable from "../components/admin/clients/ClientTable";
import { UserCheck, UserSquare, UserMinus, UserPlus, Edit, Trash2 } from "lucide-react";

const ProductsPage = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/admin-service/api/admin/getAllClients") // Địa chỉ API của bạn
      .then((response) => {
        setClients(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

	// Hàm để mở form chỉnh sửa
	const handleEditClick = (client) => {
		setEditClient(client); // Lưu thông tin client cần chỉnh sửa
		setIsEditFormOpen(true); // Mở form chỉnh sửa
	};

  // Hàm đóng form chỉnh sửa
  const closeEditForm = () => {
    setIsEditFormOpen(false);
    setEditClient(null);
  };

  const handleSaveClient = (updatedClient) => {
    // Update the client information here
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
    closeEditForm(); // Close the edit form after saving
  };

  const filteredRows = useMemo(() => {
    let filtered = clients;

    // Lọc theo status nếu có
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Lọc theo searchQuery nếu có
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const searchableFields = [
          item.username,
          item.role,
          item.email,
          item.phone,
          item.status,
        ];
        return searchableFields.some((field) =>
          String(field).toLowerCase().includes(search)
        );
      });
    }

    return filtered;
  }, [searchQuery, statusFilter, clients]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset page khi thay đổi số dòng mỗi trang
  };

  return (
    <div className="flex-1 bg-[#ffffff] bg-opacity-90 overflow-auto relative z-10">
      <Header title="Clients" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Clients" icon={UserSquare} value={1234} color="#6366F1" />
          <StatCard name="Active Clients" icon={UserCheck} value={89} color="#00FF00" />
          <StatCard name="Inactive Clients" icon={UserMinus} value={23} color="#FF0000" />
          <StatCard name="New Clients" icon={UserPlus} value={"$543,210"} color="#6366F1" />
        </motion.div>

        {/* CLIENT GRID */}
        <div className="flex justify-between items-center bg-white shadow-sm rounded-md p-4 mb-6 border-gray-200 border font-semibold text-gray-600">
          <h2 className="text-lg font-semibold">Client Grid</h2>
          <div className="flex space-x-4">
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm">
              <option>Sort By: Last 7 Days</option>
              <option>Sort By: Last 30 Days</option>
              <option>Sort By: All Time</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-gray-600">
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm font-medium">
              Row Per Page
            </label>
            <select
              id="rowsPerPage"
              className="border rounded-md px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm">Entries</span>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md px-4 py-1 text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 when search query changes
              }}
            />
          </div>
        </div>

        <ClientTable clients={clients} currentRows={currentRows} handleEditClick={handleEditClick} />

			
		      <div className="flex items-center justify-between mt-4 text-gray-600">
            {/* Left: Showing Info */}
            <div className="text-sm">
              Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredRows.length)} of {filteredRows.length} entries
            </div>

            {/* Right: Pagination */}
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  className={`px-3 py-1 border rounded-full ${
                    currentPage === page + 1 ? "bg-orange-500 text-white" : "text-gray-700"
                  }`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border rounded-md ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>


      </main>

	  {isEditFormOpen && editClient && (
        <div className="fixed overflow-y-auto px-6 py-8 inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20 text-gray-600">
          <EditClientForm
            client={editClient}
            onSave={handleSaveClient}
            onCancel={closeEditForm}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
