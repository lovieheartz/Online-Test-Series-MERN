import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCreateAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    existingAdminEmail: "",
    existingAdminPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, phone, existingAdminEmail, existingAdminPassword } = formData;

    // Validate all fields
    if (!name || !email || !password || !existingAdminEmail || !existingAdminPassword || !phone) {
      setError("All fields including existing admin credentials are required.");
      return;
    }

    try {
      // No need for token here because existing admin email/password will be checked explicitly
      const res = await axios.post(
        "http://localhost:3001/admin/create-admin",
        {
          name,
          email,
          password,
          phone,
          existingAdminEmail,
          existingAdminPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(res.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone:"",
        existingAdminEmail: "",
        existingAdminPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Create admin error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create admin.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Admin</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* New Admin Details */}
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="New Admin Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
  style={styles.input}
  type="tel"
  name="phone"
  placeholder="New Admin Phone (+1234567890)"
  value={formData.phone}
  onChange={handleChange}
  autoComplete="off"
/>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="New Admin Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="New Admin Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {/* Existing Admin Credentials */}
        <input
          style={styles.input}
          type="email"
          name="existingAdminEmail"
          placeholder="Existing Admin Email"
          value={formData.existingAdminEmail}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          style={styles.input}
          type="password"
          name="existingAdminPassword"
          placeholder="Existing Admin Password"
          value={formData.existingAdminPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <button type="submit" style={styles.submitButton}>
          Create Admin
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#f7f9fc",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  submitButton: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default AdminCreateAdmin;
