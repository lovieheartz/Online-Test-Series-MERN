import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password,phone} = formData;

    if (!name || !email || !password || !phone) {
      setError("All fields are required.");
      return;
    }

    try {
      // ✅ Check if admin exists during submission
      const check = await axios.get("http://localhost:3001/admin/exists");
      if (check.data.exists) {
        setError("Admin already exists. You cannot create another one.");
        return;
      }

      // ✅ Continue to create the admin
      const res = await axios.post("http://localhost:3001/create-admin", {
        name,
        email,
        password,
        phone, // add this to avoid missing field error if required
      });

      if (res.data) {
        setSuccess("Admin created successfully!");
        setFormData({ name: "", email: "", password: "" ,phone:""});
      }
    } catch (err) {
      console.error(err);
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
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <input
  style={styles.input}
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={formData.phone}
  onChange={handleChange}
/>
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
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

export default CreateAdmin;
