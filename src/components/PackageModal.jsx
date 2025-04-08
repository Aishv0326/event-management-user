// src/components/PackageModal.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PackageModal = ({ show, onClose, editingPackage, refreshPackages }) => {
  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    maxGuests: "",
    durationHours: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        packageName: editingPackage.packageName || "",
        description: editingPackage.description || "",
        price: editingPackage.price || "",
        maxGuests: editingPackage.maxGuests || "",
        durationHours: editingPackage.durationHours || "",
      });
    } else {
      setFormData({
        packageName: "",
        description: "",
        price: "",
        maxGuests: "",
        durationHours: "",
      });
    }
  }, [editingPackage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.packageName.trim()) newErrors.packageName = "Package name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (!formData.maxGuests || isNaN(formData.maxGuests)) newErrors.maxGuests = "Max guests must be a number";
    if (!formData.durationHours || isNaN(formData.durationHours)) newErrors.durationHours = "Duration must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = editingPackage
        ? `http://localhost:5086/api/EventPackage/${editingPackage.packageId}`
        : "http://localhost:5086/api/EventPackage/create";

      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: formData.packageName,
          description: formData.description,
          price: parseFloat(formData.price),
          maxGuests: parseInt(formData.maxGuests),
          durationHours: parseInt(formData.durationHours),
        }),
      });

      const result = await res.json();
      setLoading(false);

      if (res.ok) {

        toast.success(editingPackage ? "Package updated successfully!" : "Package created successfully!");    
        setFormData({
          packageName: "",
          description: "",
          price: "",
          maxGuests: "",
          durationHours: "",
        });
        onClose();
        refreshPackages(); // fetch latest after create/edit
      } else {
        setErrors({ general: result.message || "Operation failed" });
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
        <h3 className="text-center">{editingPackage ? "Edit Package" : "Create Package"}</h3>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          {["packageName", "description", "price", "maxGuests", "durationHours"].map((field) => (
            <div key={field}>
              <label className="form-label">
                {field === "packageName"
                  ? "Package Name"
                  : field === "durationHours"
                  ? "Duration (in Hours)"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={["price", "maxGuests", "durationHours"].includes(field) ? "number" : "text"}
                name={field}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                value={formData[field]}
                onChange={handleChange}
              />
              {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
            </div>
          ))}

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="submit" className="btn create-btn" disabled={loading}>
              {loading ? (editingPackage ? "Updating..." : "Creating...") : editingPackage ? "Update Package" : "Create Package"}
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

export default PackageModal;
