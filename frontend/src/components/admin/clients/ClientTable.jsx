import React from 'react';
import { Edit, Trash2, BanIcon, UnlockIcon } from 'lucide-react';

const ClientTable = ({ clients, currentRows, handleEditClick,  handleDeleteClick, handleBlockClick, handleUnBlockClick, clientStatus }) => {

  return (
    <div className="overflow-x-auto text-gray-600">
      <table className="min-w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">Client Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b flex items-center gap-2">
                <img
                  src={client.imageUrl || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div className="font-semibold">{client.username}</div>
                  <div className="text-sm text-gray-500">{client.role}</div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">{client.email}</td>
              <td className="py-2 px-4 border-b">{client.phone}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 text-sm rounded-full font-semibold ${
                    client.status === "Inactive"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  { client.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => handleEditClick(client)}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="text-red-500 hover:text-red-700 mr-2"
                  onClick={() => handleDeleteClick(client)} 
                >
                  <Trash2 size={18} />
                </button>
                {
                  client.status === "Active" ? (
                    <button className="text-red-500 hover:text-red-700"
                      onClick={() => handleBlockClick(client)}
                    >
                      <BanIcon size={18} />
                    </button>
                  ) : (
                    <button className="text-green-500 hover:text-green-700"
                      onClick={() => handleUnBlockClick(client)}
                    >
                      <UnlockIcon size={18} />
                    </button>
                  )
                }
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
