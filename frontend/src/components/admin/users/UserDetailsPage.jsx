import React from 'react';

const UserDetailsPage = ({ selectedUser, handleBackClick }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          className="flex items-center text-gray-500 hover:text-gray-700 font-semibold"
          onClick={handleBackClick}
        >
          ← Back to Users
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Edit Project
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 text-gray-600">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/4 bg-white shadow rounded-lg p-6 sticky top-0 self-start min-h-[500px]">
          <h2 className="text-xl font-semibold mb-4">Classroom Details</h2>
          <table className="w-full text-sm truncate max-w-[120px]">
            <tbody>
              <tr className="border-b p-4">
                <td className="font-semibold text-gray-600">Name</td>
                <td>{selectedUser.name}</td>
              </tr>
              <tr className="border-b py-4">
                <td className="font-semibold text-gray-600">Created on</td>
                <td>
                  {new Date(selectedUser.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>

              <tr className="border-b py-4">
                <td className="font-semibold text-gray-600">Started on</td>
                <td>
                  {new Date(selectedUser.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
              <tr className="border-b py-4">
                <td className="font-semibold text-gray-600">Updated on</td>
                <td>
                  {new Date(selectedUser.updatedAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
              <tr className="border-b py-4">
                <td className="font-semibold text-gray-600">Created by</td>
                <td className="truncate max-w-[120px]">{selectedUser.owner}</td>
              </tr>
              
            </tbody>
          </table>

          {/* Tasks Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Tiến độ hoàn thành</h3>
            <p>Tasks Done: 0/0</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">0% Completed</p>
          </div>
        </div>



        {/* RIGHT SIDE */}
        <div className="w-full lg:w-3/4">
          {/* Description */}
          <div className="bg-white shadow rounded-lg mb-6 p-4">
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
            <p className="text-gray-600 mt-2">
              {selectedUser.description}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Attendance</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600">
              <li>Attendance Record 1</li>
              <li>Attendance Record 2</li>
              <li>Attendance Record 3</li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Tasks</h3>
            <p>Tasks Done: 0/0</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">0% Completed</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Teachers</h3>
            <div className="flex gap-3 flex-wrap mb-6">
              <div className="flex flex-col gap-2">
                {selectedUser.teacherEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src="/path/to/avatar.jpg"
                      alt={`Avatar of ${email}`}
                      className="w-8 h-8 rounded-full"
                    />
                    {email}
                  </div>
                  
                ))}

                <button className="flex items-center text-blue-500 border border-blue-500 rounded px-2 py-1 hover:bg-blue-100">
                  + Add New
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Classmates</h3>
            <div className="flex gap-3 flex-wrap mb-6">
              <div className="flex flex-col gap-2">
                {selectedUser.studentEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src="/path/to/avatar.jpg"
                      alt={`Avatar of ${email}`}
                      className="w-8 h-8 rounded-full"
                    />
                    {email}
                  </div>
                  
                ))}

                <button className="flex items-center text-blue-500 border border-blue-500 rounded px-2 py-1 hover:bg-blue-100">
                  + Add New
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
