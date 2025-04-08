import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BookedPackagesPage = () => {
  const [bookedPackages, setBookedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleID = parseInt(sessionStorage.getItem("roleID"));
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in or session expired.");
      setLoading(false);
      return;
    }

    fetchBookedPackages();
  }, []);

  const fetchBookedPackages = async () => {
    try {
      const endpoint = roleID === 0
        ? "http://localhost:5086/api/BookedPackage"
        : `http://localhost:5086/api/BookedPackage/user/${userId}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch booked packages");

      const data = await response.json();
      setBookedPackages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookedPackageId, status) => {
    try {
      const response = await fetch(`http://localhost:5086/api/BookedPackage/update-status/${bookedPackageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      fetchBookedPackages(); // Refresh list
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleConfirm = (id) => updateStatus(id, "Confirmed");
  const handleReject = (id) => updateStatus(id, "Rejected");

  return (
    <div className="events-container">
      <h3 className="heading-style">Booked Packages</h3>

      {loading && <p>Loading packages...</p>}
      {error && <p className="error">{error}</p>}

      <div className="event-list">
        {bookedPackages.length > 0 ? (
          bookedPackages.map((pkg) => {
            const formattedDate = pkg.bookingDate
              ? new Date(pkg.bookingDate).toLocaleDateString("en-GB")
              : "N/A";

            return (
              <div key={pkg.id} className="event-card">
                <h2>{pkg.packageName}</h2>
                <p><strong>Status:</strong> {pkg.status}</p>
                <p><strong>Booked On:</strong> {formattedDate}</p>
                <p><strong>Price:</strong> ₹{pkg.price}</p>
                <p><strong>Max Guests:</strong> {pkg.maxGuests}</p>
                <p><strong>Duration:</strong> {pkg.durationHours} hrs</p>

                {pkg.status !== "Confirmed" && pkg.status !== "Rejected" && (
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleConfirm(pkg.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(pkg.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          !loading && <p>No packages booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookedPackagesPage;
