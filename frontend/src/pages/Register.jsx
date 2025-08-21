import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Fixed import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiRoutes";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "service_provider",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState(""); // Added missing otp state
  const [message, setMessage] = useState(""); // Added missing message state
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtpAndOpenModal = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/service-provider-send-otp", {
        email: formData.email,
      });

      console.log("OTP sent:", response.data);
      setShowModal(true);
      setMessage("OTP sent successfully to your email!");
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleClose = () => { // Fixed function name
    setShowModal(false);
    setOtp("");
    setMessage("");
  };

const handleVerifyAndRegisterProvider = async (e) => {
  if (e) e.preventDefault();

  setError("");
  setSuccess("");

  const {
    first_name,
    last_name,
    email,
    phone,
    username,
    password,
    confirmPassword,
    role,
  } = formData;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !username ||
    !password ||
    !confirmPassword
  ) {
    setError("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    // Step 1: Verify OTP
    const verifyRes = await axios.post("http://localhost:3000/api/user/provider-verify-otp", {
      email,
      otp,
    });

    if (!verifyRes.data.success) {
      setMessage("Invalid OTP. Please try again.");
      return;
    }

    setMessage("OTP verified successfully!");

    // Step 2: Register service provider after OTP verification
    const registerRes = await axios.post(`${API_BASE_URL}/api/user/register-service-provider`, {
      first_name,
      last_name,
      email,
      phone,
      username,
      password,
      role,
    });

    if (registerRes.data?.message) {
      setSuccess(registerRes.data.message);
      setShowModal(false); // Close modal on success
      setTimeout(() => navigate("/"), 2000);
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Process failed, please try again.");
  }
};



  return (
<div className="container mt-5" style={{ maxWidth: "600px" }}>
  <h2 className="mb-4 text-center">Register</h2>
  {error && <div className="alert alert-danger">{error}</div>}
  {success && <div className="alert alert-success">{success}</div>}

  {/* Remove onSubmit here */}
  <form>
    <div className="row mb-3">
      <div className="col">
        <label className="form-label">First Name</label>
        <input
          type="text"
          name="first_name"
          className="form-control"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="col">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          name="last_name"
          className="form-control"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        name="email"
        className="form-control"
        value={formData.email}
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Phone</label>
      <input
        type="text"
        name="phone"
        className="form-control"
        value={formData.phone}
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Username</label>
      <input
        type="text"
        name="username"
        className="form-control"
        value={formData.username}
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Password</label>
      <input
        type="password"
        name="password"
        className="form-control"
        value={formData.password}
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        className="form-control"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
    </div>

    <div className="mb-4">
      <label className="form-label">Role</label>
      <select
        name="role"
        className="form-select"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="service_provider">Service Provider</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>
    </div>

    <Button 
      type="button" 
      className="btn btn-primary"
      onClick={handleSendOtpAndOpenModal}
    >
      Send OTP & Verify
    </Button>
  </form>

  <Modal show={showModal} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Enter OTP</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formOtp">
          <Form.Label>Enter the 6-digit OTP sent to your email</Form.Label>
          <Form.Control
            type="text"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </Form.Group>
      </Form>
      {message && <p className="mt-3">{message}</p>}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleVerifyAndRegisterProvider} disabled={!otp}>
        Verify OTP
      </Button>
    </Modal.Footer>
  </Modal>
</div>

  );
};

export default Register;