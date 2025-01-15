import React, { useState, useEffect } from 'react';
import axios from "axios";

const UserCard = ({ user, onClick }) => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:4000/admin-service/api/admin/getClientsByEmail", { email: user.owner }) 
      .then((response) => {
        setClients(response.data); 
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Error retrieving client by email.");
        setClients([]);
      });
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow text-gray-600 cursor-pointer"
    onClick={() => onClick(user)}>
      <div className="flex items-center space-x-4">
        <img
          src={clients.imageUrl}
          alt={user.name}
          className="w-1/4 h-14 rounded-full border-2 border-green-500"
        />
        <div className="w-3/4">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <span className="text-sm text-pink-500">{user.role}</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Project: <span className="font-medium">{user.name}</span>
      </p>
      <p className="mt-3 text-sm text-gray-600">
        Room code: <span className="font-medium">{user.roomCode}</span>
      </p>
      
      <div className="mt-3 text-xs text-gray-500">{user.owner}</div>
    </div>
  );
};

export default UserCard;
