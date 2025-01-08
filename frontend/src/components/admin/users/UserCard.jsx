import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
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
        Project: <span className="font-medium">{user.project}</span>
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {user.team.map((member, index) => (
              <img
                key={index}
                src={member.avatar}
                alt={member.name}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">+{user.extraTeamCount}</span>
        </div>
        <span className="text-sm font-medium">{user.progress}%</span>
      </div>
      <div className="mt-3 text-xs text-gray-500">{user.company}</div>
    </div>
  );
};

export default UserCard;
