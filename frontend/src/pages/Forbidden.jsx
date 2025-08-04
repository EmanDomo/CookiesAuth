import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../apiRoutes";

const Forbidden = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${ API_BASE_URL }/api/user/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      navigate("/"); // still redirect home even if logout fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        Logout &amp; Go Home
      </button>
    </div>
  );
};

export default Forbidden;
