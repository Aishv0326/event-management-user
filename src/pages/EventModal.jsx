import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../css/EventModal.css";

const SERVICE_OPTIONS = [
  "Photography", "Videography", "Catering", "Decoration", "Lighting", "Sound System", "DJ", "Pandit",
  "Anchor/Host", "Live Band", "Stage Setup", "Flower Arrangement", "Birthday Cake", "Anniversary Cake",
  "Marriage Cake", "Invitation Printing", "Transportation", "Luxury Car Rental", "Doli", "Cradle", "Security",
  "Cleaning Services", "Welcome Drinks", "Mehendi Artist", "Makeup Artist", "Bridal Dressing", "Fireworks",
  "Event Planning", "Venue Management", "Photo Booth", "Guest Management", "Return Gifts", "Kids Entertainment",
  "Traditional Dance", "Live Cooking Counter", "Bouncer Services", "Drone Photography"
];

const EventModal = ({ isOpen, onClose, category, categories, venues }) => {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const selected = categories.find((cat) => cat.name === category);
    if (selected) setSelectedCategory(selected.id);
  }, [category, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      userId: sessionStorage.getItem("userId"),
      eventId: selectedCategory,
      venueId: selectedVenue || null,
      bookingDate,
      duration,
      status: "pending",
      services: selectedServices.join(","),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5086/api/BookedEvent/booked-event-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.status === 200) {
        toast.success("Event booked successfully!");

        // Give time for toast to render before reload
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Failed to book event");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while booking the event");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <h3 className="text-center">Book Event</h3>
        <form onSubmit={handleSubmit}>
          <label>Event Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <label>Venue:</label>
          <select value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)} required>
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>{venue.name}</option>
            ))}
          </select>

          <label>Date & Time:</label>
          <input type="datetime-local" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />

          <label>Duration (hours):</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" required />

          <label>Services:</label>
          <div className="services-multiselect">
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <button
                  type="button"
                  key={service}
                  className={`service-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices(selectedServices.filter((s) => s !== service));
                    } else {
                      setSelectedServices([...selectedServices, service]);
                    }
                  }}
                >
                  {service}
                </button>
              );
            })}
          </div>

          <div className="modal-buttons">
            <button type="submit" className="create-btn">Book</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
