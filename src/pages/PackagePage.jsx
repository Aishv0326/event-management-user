// src/pages/PackagePage.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PackageModal from "../components/PackageModal";
import "../css/PackagePage.css";

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = () => {
    fetch("http://localhost:5086/api/EventPackage/all")
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Error fetching packages:", err));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`http://localhost:5086/api/EventPackage/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Package deleted successfully!");
        fetchPackages();
      } else {
        toast.error("Failed to delete package.");
      }
    } catch (err) {
      toast.error("Delete error:", err);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPackage(null); // Reset edit state
  };

  return (
    <div className="packages-page">
      <h2>Event Packages</h2>
      <button className="btn btn-primary m-3" onClick={() => setShowModal(true)}>
        Create Package
      </button>

      <div className="package-cards">
        {packages.map((pkg) => (
          <div key={pkg.packageId} className="package-card">
            <h3>{pkg.packageName}</h3>
            <p>Price: ${pkg.price}</p>
            <p>Description: {pkg.description}</p>
            <p>Duration: {pkg.durationHours} hrs</p>
            <p>Max Guests: {pkg.maxGuests}</p>

            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm" style={{ backgroundColor: "rgb(106 100 100)", color: "white" }} onClick={() => handleEdit(pkg)}>
                Edit
              </button>
              <button className="btn btn-sm" style={{ backgroundColor: "#ef0017", color: "white" }} onClick={() => handleDelete(pkg.packageId)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <PackageModal
        show={showModal}
        onClose={handleModalClose}
        editingPackage={editingPackage}
        refreshPackages={fetchPackages}
      />
    </div>
  );
};

export default PackagePage;
