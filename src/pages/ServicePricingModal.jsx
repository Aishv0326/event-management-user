import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ServicePricingModal = ({ show, onClose, editingService, refreshServices }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceName: editingService.serviceName || "",
        price: editingService.price || "",
        description: editingService.description || "",
      });
    } else {
      setFormData({
        serviceName: "",
        price: "",
        description: "",
      });
    }
  }, [editingService]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const url = editingService
  //       ? `http://localhost:5086/api/ServicePricing/update/${editingService.id}`
  //       : "http://localhost:5086/api/ServicePricing/create";

  //     const method = editingService ? "PUT" : "POST";

  //     const res = await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         serviceName: formData.serviceName,
  //         price: parseFloat(formData.price),
  //         description: formData.description,
  //       }),
  //     });

  //     const result = await res.json();
  //     setLoading(false);

  //     if (res.ok) {
  //       toast.success(editingService ? "Service updated!" : "Service added!");
  //       setFormData({
  //         serviceName: "",
  //         price: "",
  //         description: "",
  //       });
  //       onClose();
  //       refreshServices(); // Refresh the list
  //     } else {
  //       setErrors({ general: result.message || "Operation failed" });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setErrors({ general: "Something went wrong!" });
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const url = editingService
        ? `http://localhost:5086/api/ServicePricing/update/${editingService.id}`
        : "http://localhost:5086/api/ServicePricing/create";
  
      const method = editingService ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: formData.serviceName,
          price: parseFloat(formData.price),
          description: formData.description,
        }),
      });
  
      // First check if the response has content
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
  
      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }
  
      toast.success(editingService ? "Service updated!" : "Service added!");
      setFormData({
        serviceName: "",
        price: "",
        description: "",
      });
      onClose();
      refreshServices();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-center">{editingService ? "Edit Service" : "Add New Service"}</h3>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Service Name</label>
            <input
              type="text"
              name="serviceName"
              className={`form-control ${errors.serviceName ? "is-invalid" : ""}`}
              value={formData.serviceName}
              onChange={handleChange}
            />
            {errors.serviceName && <div className="invalid-feedback">{errors.serviceName}</div>}
          </div>

          <div>
            <label className="form-label">Price</label>
            <input
              type="number"
              name="price"
              className={`form-control ${errors.price ? "is-invalid" : ""}`}
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (editingService ? "Updating..." : "Adding...") : editingService ? "Update" : "Add"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicePricingModal;
