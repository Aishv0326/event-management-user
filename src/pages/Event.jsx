import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in or session expired.");
      setLoading(false);
      return;
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5086/api/BookedEvent/booked-events/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookedEventId, status) => {
    console.log("Updating status for event ID:", bookedEventId, "to", status);
    try {
      const response = await fetch(`http://localhost:5086/api/BookedEvent/update-status/${bookedEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh event list after update
      fetchEvents();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleConfirm = (id) => updateStatus(id, "Confirmed");
  const handleReject = (id) => updateStatus(id, "Rejected");

  return (
    <div className="events-container">
      <h3 className="heading-style">Booked Events</h3>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      <div className="event-list">
        {events.length > 0 ? (
          events.map((event) => {
            console.log("Event data:", event); // Log event data for debugging
            const formattedDate = event.bookingDate
              ? new Date(event.bookingDate).toLocaleDateString("en-GB")
              : "N/A";

            // Split the services into an array
            const servicesArray = event.services ? event.services.split(",") : [];

            return (
              <div key={event.id} className="event-card">
                <h2>{event.categoryName}</h2>
                <p>Category: {event.categoryName}</p>
                <p>Duration: {event.duration} hrs</p>
                <p>Status: <strong>{event.status}</strong></p>
                <p>Booking Date: {formattedDate}</p>
                <p>Venue: {event.venueName || "Not Selected!"}</p>
                
                {/* Display up to 2 services */}
                <div className="services-wrapper">
                  <p className="services-display">
                    <span className="services-label">Services:</span>{" "}
                    <span className="services-text">
                      {servicesArray.slice(0, 2).join(", ")}
                      {servicesArray.length > 2 && <span className="more-services"> ...more</span>}
                      <span className="all-services-hover">
                        {servicesArray.join(", ")}
                      </span>
                    </span>
                  </p>
                </div>


                {event.status !== "Confirmed" && event.status !== "Rejected" && (
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleConfirm(event.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(event.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          !loading && <p>No events booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
