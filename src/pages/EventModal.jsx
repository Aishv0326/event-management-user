import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../css/EventModal.css";

const EventModal = ({ isOpen, onClose, category, categories, venues }) => {
  if (!isOpen) return null;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const selected = categories?.find((cat) => cat.name === category);
    if (selected) setSelectedCategory(selected.id);
  }, [category, categories]);

  useEffect(() => {
    fetch("http://localhost:5086/api/ServicePricing")
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setServices(response.data); // ✅ Only set the array, not the whole response
        } else {
          console.error("Unexpected response:", response);
          setServices([]); // fallback
        }
      })
      .catch(error => {
        console.error("Error fetching services:", error);
        setServices([]); // fallback
      });
  }, []);
  

  useEffect(() => {
    const total = services
      ?.filter((service) => selectedServices.includes(service.serviceName))
      ?.reduce((sum, service) => sum + parseFloat(service.price), 0);
  
    setTotalPrice(total);
  }, [selectedServices, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service to proceed");
      return;
    }
  
    const eventData = {
      userId: sessionStorage.getItem("userId"),
      eventCategoryId: selectedCategory, // Changed from eventId
      venueId: selectedVenue || null,
      bookingDate,
      duration,
      status: "pending",
      services: selectedServices.join(","),
      totalPrice: totalPrice,
      tax: totalPrice * 0.18,
      grandTotal: totalPrice * 1.18,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    try {
      const response = await fetch("http://localhost:5086/api/BookedEvent/booked-event-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
  
      if (response.ok) {
        toast.success("Event booked successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to book event");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while booking the event");
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Add validation for services
  //   if (selectedServices.length === 0) {
  //     toast.error("Please select at least one service to proceed");
  //     return;
  //   }
  
  //   const eventData = {
  //     userId: sessionStorage.getItem("userId"),
  //     eventId: selectedCategory,
  //     venueId: selectedVenue || null,
  //     bookingDate,
  //     duration,
  //     status: "pending",
  //     services: selectedServices.join(","),
  //     totalPrice: totalPrice,
  //     tax: totalPrice * 0.18,
  //     grandTotal: totalPrice * 1.18, // Price + 18% tax
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };
  
  //   try {
  //     debugger
  //     const response = await fetch("http://localhost:5086/api/BookedEvent/booked-event-create", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(eventData),
  //     });
  
  //     if (response.ok) {
  //       toast.success("Event booked successfully!");
  //       setTimeout(() => {
  //         onClose();
  //         window.location.reload();
  //       }, 3000);
  //     } else {
  //       toast.error("Failed to book event");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     toast.error("Something went wrong while booking the event");
  //   }
  // };
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
            {services?.map((service) => {
              const isSelected = selectedServices?.includes(service.serviceName);
              return (
                <button
                  type="button"
                  key={service.id}
                  className={`service-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedServices(selectedServices?.filter((s) => s !== service.serviceName));
                    } else {
                      setSelectedServices([...selectedServices, service.serviceName]);
                    }
                  }}
                >
                  {service.serviceName} - ${service.price}
                </button>
              );
            })}
          </div>
          {/* <div className="total-price">
            <strong>Total Service Price:</strong> ${totalPrice.toFixed(2)} <br />
            <strong>Tax (18%):</strong> ${(totalPrice * 0.18).toFixed(2)} <br />
          </div> */}
          <div className="total-price">
            {selectedServices.length > 0 ? (
              <>
                <strong>Total Service Price:</strong> ${totalPrice.toFixed(2)} <br />
                <strong>Tax (18%):</strong> ${(totalPrice * 0.18).toFixed(2)} <br />
                <strong>Grand Total:</strong> ${(totalPrice * 1.18).toFixed(2)} <br />
              </>
            ) : (
              <p className="text-warning">Please select at least one service</p>
            )}
          </div>
          <div className="modal-buttons">
            {/* <button type="submit" className="create-btn">Book</button> */}
            <button 
  type="submit" 
  className="create-btn"
  disabled={selectedServices.length === 0}
>Book</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EventModal;
