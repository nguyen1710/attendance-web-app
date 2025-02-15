import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const UnBlockClientModal  = ({ client, onConfirm, onCancel }) => {
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 text-gray-600">
        <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h3 className="text-lg font-semibold">Are you sure you want to unblock {client.username}?</h3>
        <div className="flex justify-end mt-4">
            <button className="mr-4 px-4 py-2 bg-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md" onClick={() => onConfirm(client._id)}>Block</button>
        </div>
        </div>
    </div>
  );
};

export default UnBlockClientModal;
