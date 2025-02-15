import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import EditClientForm from "../components/admin/clients/EditClientForm";
import DeleteClientModal from "../components/admin/clients/DeleteClientModal";
import BlockClientModal from "../components/admin/clients/BlockClientModal";
import UnBlockClientModal from "../components/admin/clients/UnBlockClientModal";

import { toast } from "react-toastify";

import ClientTable from "../components/admin/clients/ClientTable";
import { UserCheck, UserSquare, UserMinus, UserPlus, Edit, Trash2 } from "lucide-react";

const ProductsPage = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const clientCount = clients.length;
  const [newClientsCount, setNewClientsCount] = useState(0); 
  const [activeClient, setActiveClient] = useState(0);
  const [inactiveClient, setInactiveClient] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnBlockModalOpen, setIsUnBlockModalOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const API_URL_BASE = import.meta.env.VITE_API_BASE_URL


  useEffect(() => {
    axios
      .get(`${API_URL_BASE}/admin-service/api/admin/getAllClients`) // Địa chỉ API của bạn
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL_BASE}/admin-service/api/admin/getNewClients`)
      .then((response) => {
        setNewClientsCount(response.data.count);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL_BASE}/admin-service/api/admin/getClientsByStatus`)
      .then((response) => {
        setActiveClient(response.data.active);
        setInactiveClient(response.data.inactive);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

	const handleEditClick = (client) => {
		setEditClient(client); 
		setIsEditFormOpen(true);
	};

  const handleDeleteClick = (client) => {
		setSelectedClient(client); 
    setIsDeleteModalOpen(true);
	};

  const handleBlockClick = (client) => {
		setSelectedClient(client); 
    setIsBlockModalOpen(true);
	};

  const handleUnBlockClick = (client) => {
		setSelectedClient(client); 
    setIsUnBlockModalOpen(true);
	};

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`${API_URL_BASE}/admin-service/api/admin/deleteClient`, {data: { clientId: clientId }  })
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          setError(error.message);
        });

        
        setClients(clients.filter((client) => client._id !== clientId));
        setIsDeleteModalOpen(false); 
    } catch (error) {
        console.error("Error deleting client:", error);
        setError("Failed to delete the client.");
    }
};
  
const handleBlockClient = (clientId) => {
  try {
    setClients(prevClients => 
      prevClients.map((client) => 
        client._id === clientId ? { ...client, status: "Inactive" } : client
      )
    );

    axios
      .put(`${API_URL_BASE}/admin-service/api/admin/blockClient`, { clientId, status: "Inactive" })
      .then((response) => {
        console.log("Client blocked successfully:", response.data);
        toast.success(response.data.message);
        setIsBlockModalOpen(false); 
      })
      .catch((error) => {
        console.error("Error block client:", error);
      });
    
    setIsBlockModalOpen(false);

  } catch (error) {
    console.error("Error blocking client:", error);
    setError("Failed to block the client.");
  }
};

const handleUnBlockClient = (clientId) => {
  try {
    setClients(prevClients => 
      prevClients.map((client) => 
        client._id === clientId ? { ...client, status: "Active" } : client
      )
    );

    axios
      .put(`${API_URL_BASE}/admin-service/api/admin/blockClient`, { clientId, status: "Active" })
      .then((response) => {
        toast.success("Client Unblocked successfully:");
        setIsBlockModalOpen(false); 
      })
      .catch((error) => {
        console.error("Error Unblock client:", error);
      });
    
    setIsUnBlockModalOpen(false);

  } catch (error) {
    console.error("Error blocking client:", error);
    setError("Failed to block the client.");
  }
};

  // Hàm đóng form chỉnh sửa
  const closeEditForm = () => {
    window.location.reload();
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

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

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

    if (sortOrder === "A → Z") {
      filtered = filtered.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
    } else if (sortOrder === "Z → A") {
      filtered = filtered.sort((a, b) =>
        b.username.localeCompare(a.username)
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, clients, sortOrder]);


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
          <StatCard name="Total Clients" icon={UserSquare} value={clientCount} color="#6366F1" />
          <StatCard name="Active Clients" icon={UserCheck} value={activeClient} color="#00FF00" />
          <StatCard name="Inactive Clients" icon={UserMinus} value={inactiveClient} color="#FF0000" />
          <StatCard name="New Clients" icon={UserPlus} value={newClientsCount} color="#6366F1" />
        </motion.div>

        {/* CLIENT GRID */}
        <div className="flex justify-between items-center bg-white shadow-sm rounded-md p-4 mb-6 border-gray-200 border font-semibold text-gray-600">
          <h2 className="text-lg font-semibold">Client Grid</h2>
          <div className="flex space-x-4">
            {/* <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select> */}
            <select
              className="border border-gray-300 rounded-md p-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort by: Name </option>
              <option value="A → Z">A ⮁ Z</option>
              <option value="Z → A">Z ⮃ A</option>
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

        <ClientTable clients={clients} currentRows={currentRows} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} 
        handleBlockClick={handleBlockClick} handleUnBlockClick={handleUnBlockClick} clientStatus={clients.status || "Active"} />

			
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

    {isDeleteModalOpen && selectedClient && (
      <DeleteClientModal
        client={selectedClient}
        onConfirm={handleDeleteClient}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    )}

    {isBlockModalOpen && selectedClient && (
      <BlockClientModal
        client={selectedClient}
        onConfirm={handleBlockClient}
        onCancel={() => setIsBlockModalOpen(false)}
      />
    )}

    {isUnBlockModalOpen && selectedClient && (
      <UnBlockClientModal
        client={selectedClient}
        onConfirm={handleUnBlockClient}
        onCancel={() => setIsUnBlockModalOpen(false)}
      />
    )}


    
    </div>
  );
};

export default ProductsPage;
