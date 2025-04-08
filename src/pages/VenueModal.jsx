import React, { useState } from "react";
import { toast } from "react-toastify";

const VenueModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Venue Name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity.trim() || isNaN(formData.capacity))
      newErrors.capacity = "Capacity must be a valid number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5086/api/Venue/create-venue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: parseInt(formData.capacity),
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Venue Created Successfully!");
        setFormData({ name: "", location: "", capacity: "" });
        onClose();
      } else {
        setErrors({ general: result.message || "Failed to create venue" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "Something went wrong!" });
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-center">Add Venue</h3>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Venue Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              className={`form-control ${errors.capacity ? "is-invalid" : ""}`}
              value={formData.capacity}
              onChange={handleChange}
            />
            {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2">            
            <button type="submit" className="btn create-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Venue"}
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueModal;
