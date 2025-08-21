import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiRoutes";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");

      const res = await axios.post(
        `${API_BASE_URL}/api/user/user-login`,
        { username, password },
        { withCredentials: true }
      );

      console.log("Full API Response:", res.data);

      if (res.data.success) {
        const role = res.data.user?.role;
        console.log("User role:", role);

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "service_provider") {
          navigate("/home");
        } else {
          navigate("/");
        }
      } else {
        console.log("Login failed, message:", res.data.message);
        setError(res.data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={handleNavigateToRegister}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
