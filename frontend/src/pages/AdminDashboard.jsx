import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiRoutes";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    userAge: "",
    password: "",
    role: "user"
  });
  const [editUser, setEditUser] = useState(null);

    const handleLogout = async () => {
    try {
      await axios.post(`${ API_BASE_URL }/api/user/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
  try {
    const res = await axios.get(`${ API_BASE_URL }/api/user/get-all-users-admin`, {
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


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Update user
        await axios.put(`http://localhost:3000/api/user/update/${editUser.userID}`, formData, {
          withCredentials: true
        });
      } else {
        // Create user
        await axios.post("http://localhost:3000/api/user/create", formData, {
          withCredentials: true
        });
      }
      setFormData({ userName: "", userAge: "", password: "", role: "user" });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      userName: user.userName,
      userAge: user.userAge,
      password: "",
      role: user.role
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/user/delete/${id}`, {
        withCredentials: true
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container py-5">
      <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{editUser ? "Edit User" : "Add User"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="userAge"
              placeholder="Age"
              value={formData.userAge}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required={!editUser} // required only when creating
            />
          </div>
          <div className="col">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              {editUser ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      <h2 className="mb-4 text-center">All Users</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.userName}</td>
                <td>{user.userAge}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.userID)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
