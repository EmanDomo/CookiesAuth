import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IdleLogout from "../components/IdleLogout";
import { API_BASE_URL } from "../apiRoutes";


const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${ API_BASE_URL }/api/user/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
  try {
    const res = await axios.get(`${ API_BASE_URL }/api/user/get-all-users`, {
      withCredentials: true
    });

    console.log("API Response:", res.data);
    setUsers(res.data.users || []);
    setLoading(false);

  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        navigate("/unauthorized"); // login required
      } else if (err.response.status === 403) {
        navigate("/forbidden"); // user logged in but no permission
      } else {
        setError("Failed to fetch users");
      }
    } else {
      setError("Network error");
    }
  }
};


    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    
    <div className="container py-5">
       <IdleLogout />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Users</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      <h2 className="mb-4 text-center">All Users</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.userName}</td>
                <td>{user.userAge}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
