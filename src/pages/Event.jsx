import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RDGlcP7IKaoDACiRNAziNFiSnukACGtR5RU8W05P0dH0ZHM9PIZqBZi6VYDFmSTlxU4Ew6IvehnMBRzligWEno600SRRXd3EJ');

const Events = () => {
  const [events, setEvents] = useState([]);
  const [servicePricing, setServicePricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("userId");
  const roleId = parseInt(sessionStorage.getItem("roleID"));

  useEffect(() => {
    if (!userId) {
      setError("User not logged in or session expired.");
      setLoading(false);
      return;
    }

    fetchServicePricing();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const url = roleId === 0
        ? "http://localhost:5086/api/BookedEvent/all-booked-events"
        : `http://localhost:5086/api/BookedEvent/booked-events/${userId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicePricing = async () => {
    try {
      const response = await fetch("http://localhost:5086/api/ServicePricing");
      if (!response.ok) throw new Error("Failed to fetch service pricing");
  
      const data = await response.json();
      setServicePricing(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching service pricing:", err);
      setServicePricing([]);
    }
  };

  const updateStatus = async (eventId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5086/api/BookedEvent/update-status/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      
      const result = await response.json();
      if (status.toLowerCase() === 'confirmed') {
        toast.info("Event confirmed. User must complete payment within 48 hours.");
      } else {
        toast.success(`Status updated to ${status}`);
      }
      fetchEvents();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const processPayment = async (event) => {
    try {
      toast.info("Redirecting to payment...");
      
      // Calculate total with tax
      const servicesArray = event.services?.split(',').map(s => s.trim()) || [];
      const total = servicesArray.reduce((sum, serviceName) => {
        const service = servicePricing.find(s => s.serviceName === serviceName);
        return sum + (service?.price || 0);
      }, 0) * 1.18; // Include 18% tax

      // Create checkout session
      const response = await fetch('http://localhost:5086/api/Payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookingId: event.id,
          Amount: total,
          BookingType: 'event' // Differentiate from packages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Payment failed');
      }

      const { sessionId } = await response.json();
  
      // Redirect to Stripe
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) throw error;
    } catch (err) {
      toast.error(`Payment failed: ${err.message}`);
      console.error("Payment error:", err);
    }
  };

  const calculateTimeLeft = (paymentDueDate) => {
    if (!paymentDueDate) return null;
    const due = new Date(paymentDueDate);
    const now = new Date();
    const diff = due - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleConfirm = (id) => updateStatus(id, "confirmed");
  const handleReject = (id) => updateStatus(id, "rejected");

  return (
    <div className="events-container">
      <h3 className="heading-style">
        {roleId === 0 ? "All Booked Events" : "My Booked Events"}
      </h3>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      <div className="event-list">
        {events.length > 0 ? (
          events.map((event) => {
            const formattedDate = event.bookingDate
              ? new Date(event.bookingDate).toLocaleDateString("en-GB")
              : "N/A";

            const servicesArray = event.services?.split(',').map(s => s.trim()) || [];
            const serviceDetails = servicesArray.map(serviceName => {
              const service = servicePricing.find(s => s.serviceName === serviceName);
              return {
                name: serviceName,
                price: service?.price || "N/A"
              };
            });

            const totalServicePrice = serviceDetails.reduce((sum, s) => {
              const price = parseFloat(s.price) || 0;
              return sum + price;
            }, 0);

            const timeLeft = calculateTimeLeft(event.paymentDueDate);

            return (
              <div key={event.id} className="event-card">
                <h2>{event.eventName || "Event"}</h2>
                <p><strong>Status:</strong> 
                  <span className={`status-${event.status.toLowerCase()}`}>
                    {event.status}
                    {event.status === "confirmed" && timeLeft && (
                      <span className="time-left"> ({timeLeft})</span>
                    )}
                  </span>
                </p>
                <p><strong>Date:</strong> {formattedDate}</p>
                <p><strong>Duration:</strong> {event.duration} hours</p>
                <p><strong>Venue:</strong> {event.venueName || "Not selected"}</p>

                {serviceDetails.length > 0 && (
                  <div className="services-wrapper">
                    <p><strong>Services:</strong></p>
                    <ul>
                      {serviceDetails.map((service, index) => (
                        <li key={index}>
                          {service.name} - ${service.price}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Subtotal:</strong> ${totalServicePrice.toFixed(2)}</p>
                    <p><strong>Tax (18%):</strong> ${(totalServicePrice * 0.18).toFixed(2)}</p>
                    <p><strong>Total:</strong> ${(totalServicePrice * 1.18).toFixed(2)}</p>
                  </div>
                )}

                {/* Admin actions */}
                {roleId === 0 && event.status === "pending" && (
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

                {/* User payment button */}
                {roleId !== 0 && event.status === "confirmed" && timeLeft !== "Expired" && (
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => processPayment(event)}
                  >
                    Pay Now
                  </button>
                )}

                {/* Expired notice */}
                {event.status === "confirmed" && timeLeft === "Expired" && (
                  <div className="text-danger mt-2">
                    Payment window expired
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