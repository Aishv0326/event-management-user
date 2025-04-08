import React, { useEffect, useState } from "react";
import "../css/VenueListPage.css";
import { toast } from "react-toastify";
import VenueModal from "./VenueModal"; // Import Venue Modal

const VenueListPage = () => {
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleID = parseInt(sessionStorage.getItem("roleID")); // Optional: for admin actions

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("http://localhost:5086/api/Venue/get-venues"); // Adjust to your actual API endpoint
      if (!response.ok) throw new Error("Failed to fetch venues");

      const data = await response.json();
      setVenues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (venueId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this venue?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5086/api/Venue/delete-venue/${venueId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete venue");

      toast.success("Venue deleted successfully!");
      fetchVenues(); // Refresh list
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="venue-container">
      <h3 className="heading-style">Available Venues</h3>

      {loading && <p>Loading venues...</p>}
      {error && <p className="error">{error}</p>}

      <div className="venue-list">
      <button className="btn btn-primary create-category-btn" onClick={() => setShowVenueModal(true)}>
          Add Venue
        </button>
        {venues.length > 0 ? (
          venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <h4>{venue.name}</h4>
              <p><strong>Location:</strong> {venue.location}</p>
              <p><strong>Capacity:</strong> {venue.capacity}</p>
              

              {/* Optional: Admin actions */}
              {roleID === 0 && (
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(venue.id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          !loading && <p>No venues found.</p>
        )}
      </div>

      {/* Venue Modal */}
      <VenueModal show={showVenueModal} onClose={() => setShowVenueModal(false)} />
    </div>
    
  );
};

export default VenueListPage;
