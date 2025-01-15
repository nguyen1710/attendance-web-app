import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

const AttendanceTable = ({
  client,
  currentRows,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [allParticipants, setAllParticipants] = useState([]);

  useEffect(() => {
    if (client) {
      // Merge attendees and non-attendees
      const attendees = client.attendees || [];
      const nonAttendees = client.nonAttendees || [];

      const participants = [
        ...attendees.map((emailObj) => {
          const email = Object.values(emailObj).slice(0, -2).join('') || emailObj.email;
          return { email, status: "Present" };
        }),
        ...nonAttendees.map((emailObj) => {
          const email = Object.values(emailObj).slice(0, -2).join('') || emailObj.email;
          return { email, status: "Absent" };
        }),
      ];

      console.log(participants);

      // Set the participants state
      setAllParticipants(participants);
    }
  }, [client]);





  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="overflow-x-auto text-gray-600">
      <table className="min-w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Client Name</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b text-center">Check-in</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allParticipants.map((participant, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{formatDate(client.date)}</td>
              <td className="py-2 px-4 border-b flex items-center gap-2">
                <img
                  src={"https://via.placeholder.com/150"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div className="font-semibold">{participant.email}</div>
                  <div className="text-sm text-gray-500">Email</div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">{participant.email}</td>
              <td className="py-2 px-4 border-b text-center">-</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 text-sm rounded-full font-semibold ${
                    participant.status === "Absent"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  { participant.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditClick(client)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteClick(client)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
