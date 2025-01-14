import React from 'react';

const UserCard = ({ user, onClick }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow text-gray-600 cursor-pointer"
    onClick={() => onClick(user)}>
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-14 h-14 rounded-full border-2 border-green-500"
        />
        <div>
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
