import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5086/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.email,
          PasswordHash: formData.password,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {        
        sessionStorage.setItem("userId", result.user.userId); // Store user ID
        sessionStorage.setItem("roleID", result.user.roleID); // Store role ID
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setErrors({ general: result.message || "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "Something went wrong!" });
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center card-position" style={{ backgroundColor: "antiquewhite" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", backgroundColor: "beige" }}>
        <h3 className="text-center " style={{color: "rgb(23 42 69)"}}>Sign In</h3>
        <p className="text-center text-muted">Access your event dashboard</p>

        {errors.general && (
          <div className="alert alert-danger">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-50"
            disabled={loading}
            style={{ margin: "0 auto", display: "block" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
