import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PackageDetailsPage = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from session storage
    const role = sessionStorage.getItem("roleID");
    setUserRole(role ? parseInt(role) : null);

    const fetchPackage = async () => {
      try {
        const response = await fetch(`http://localhost:5086/api/EventPackage/${id}`);
        if (!response.ok) throw new Error("Failed to fetch package details");
        const data = await response.json();
        setPkg(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchPackage();
  }, [id]);

  const handleBook = async () => {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName") || "Guest";

    if (!userId) {
      toast.error("Please log in to book a package.");
      return;
    }

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
        durationInHours: pkg.durationHours,
      },
    };

    try {
      const response = await fetch("http://localhost:5086/api/BookedPackage/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Booking failed.");
      toast.success("Package booked successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Booking failed: " + error.message);
    }
  };

  if (!pkg) return <p className="text-center mt-4">Loading package details...</p>;

  return (
    <div className="container mt-5">
      <h2>{pkg.packageName}</h2>
      <p><strong>Description:</strong> {pkg.description}</p>
      <p><strong>Price:</strong> ${pkg.price}</p>
      <p><strong>Tax (18%):</strong> $ {(pkg.price * 0.18).toFixed(2)}</p>
      <p><strong>Total:</strong> ${(pkg.price * 1.18).toFixed(2)}</p>
      <p><strong>Max Guests:</strong> {pkg.maxGuests}</p>
      <p><strong>Duration:</strong> {pkg.durationHours} hrs</p>

      {/* Only show button for regular users (roleId 1) */}
      {userRole === 1 && (
        <button className="btn btn-primary" onClick={handleBook}>
          Book This Package
        </button>
      )}

      {/* Optional: Show message for admins */}
      {userRole !== 1 && (
        <div className="alert alert-info mt-3">
          Admins cannot book packages. Please switch to a regular user account.
        </div>
      )}
    </div>
  );
};

export default PackageDetailsPage;