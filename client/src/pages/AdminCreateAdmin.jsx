import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

  // ✅ useMutation for creating admin
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("http://localhost:3001/admin/create-admin", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(data.message || "Admin created successfully!");
      setError("");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        existingAdminEmail: "",
        existingAdminPassword: "",
      });
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      console.error("Create admin error:", err);
      const msg = err.response?.data?.message || "Failed to create admin.";
      setError(msg);
      setSuccess("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, phone, existingAdminEmail, existingAdminPassword } = formData;

    if (!name || !email || !password || !phone || !existingAdminEmail || !existingAdminPassword) {
      setError("All fields including existing admin credentials are required.");
      return;
    }

    // ✅ Trigger mutation
    mutate(formData);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Admin</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* New Admin Fields */}
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

        <button type="submit" style={styles.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create Admin"}
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
