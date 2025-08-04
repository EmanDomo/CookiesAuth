import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-lg">
        You do not have permission to access this page.  
        <br />
        <span className="font-semibold text-red-500">
          Your session may have expired or you might not have the required access rights.
        </span>
      </p>
      <button
        onClick={goHome}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;
