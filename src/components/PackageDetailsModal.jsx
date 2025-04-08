// src/components/PackageDetailsModal.jsx
import React from "react";
import { toast } from "react-toastify";

const PackageDetailsModal = ({ show, onClose, pkg, onBook }) => {
  if (!show || !pkg) return null;

  const handleBook = async () => {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName") || "Guest";
  
    if (!userId) {
      toast.error("Please log in to book a package.");
      return;
    }
  
    // Wrapping details inside a `package` object as expected by the API
    const bookingData = {
      userId: parseInt(userId),
      userName: userName,
      status: "Pending",
      bookedAt: new Date().toISOString(),
      packageId: pkg.packageId,
      package: {
        packageId: pkg.packageId,
        packageName: pkg.packageName,
        price: pkg.price,
        maxGuests: pkg.maxGuests,
        durationInHours: pkg.durationInHours
      }
    };
  
    try {
      const response = await fetch("http://localhost:5086/api/BookedPackage/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
  console.log("Booking Data:", JSON.stringify(bookingData)); // Log the booking data for debugging
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Booking failed.");
      }
  
      toast.success("Package booked successfully!");
      onClose(); // Close modal after booking
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error("Booking failed: " + error.message);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{pkg.packageName}</h3>
        <p><strong>Description:</strong> {pkg.description}</p>
        <p><strong>Price:</strong> ₹{pkg.price}</p>
        <p><strong>Max Guests:</strong> {pkg.maxGuests}</p>
        <p><strong>Duration:</strong> {pkg.durationInHours} hrs</p>

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleBook}>Book Package</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsModal;
