import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RDGlcP7IKaoDACiRNAziNFiSnukACGtR5RU8W05P0dH0ZHM9PIZqBZi6VYDFmSTlxU4Ew6IvehnMBRzligWEno600SRRXd3EJ');

const BookedPackagesPage = () => {
  const [bookedPackages, setBookedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleIDStr = sessionStorage.getItem("roleID");
  const roleID = roleIDStr !== null ? parseInt(roleIDStr, 10) : null;
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in or session expired.");
      setLoading(false);
      return;
    }
    fetchBookedPackages();
  }, [userId, roleID]);

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
      const response = await fetch(
        `http://localhost:5086/api/BookedPackage/update-status/${bookedPackageId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      
      const result = await response.json();
      if (result.requiresPayment) {
        toast.info("Package approved. User must complete payment within 48 hours.");
      } else {
        toast.success(`Status updated to ${status}`);
      }
      fetchBookedPackages();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const processPayment = async (pkg) => {
    try {
      console.log("[1] Starting payment process for package:", pkg.id);
      toast.info("Redirecting to payment...");
      
      // Debug the request payload
      const requestBody = {
        BookingId: pkg.id,
        Amount: pkg.price * 1.18,
        BookingType: 'package'
      };
      console.log("[2] Request payload:", requestBody);
  
      // 1. Create checkout session
      console.log("[3] Making API call to create session...");
      const response = await fetch('http://localhost:5086/api/Payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
  
      console.log("[4] Received response, status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[5] API Error Response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Payment failed');
        } catch {
          throw new Error(errorText || 'Payment failed');
        }
      }
  
      const responseData = await response.json();
      console.log("[6] API Success Response:", responseData);
      const { sessionId } = responseData;
      
      if (!sessionId) {
        throw new Error("No sessionId received from server");
      }
  
      // 2. Redirect to Stripe
      console.log("[7] Initializing Stripe...");
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
  
      console.log("[8] Redirecting to Stripe with sessionId:", sessionId);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error("[9] Stripe redirect error:", error);
        throw error;
      }
  
      console.log("[10] Stripe redirect successful");
    } catch (err) {
      console.error("[ERROR] Full error:", err);
      toast.error(`Payment failed: ${err.message}`);
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

  const handleApprove = (id) => updateStatus(id, "approved");
  const handleReject = (id) => updateStatus(id, "rejected");

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
            const timeLeft = calculateTimeLeft(pkg.paymentDueDate);

            return (
              <div key={pkg.id} className="event-card">
                <h2>{pkg.packageName}</h2>
                <p><strong>Status:</strong> 
                  <span className={`status-${pkg.status.toLowerCase()}`}>
                    {pkg.status}
                    {pkg.status === "approved" && timeLeft && (
                      <span className="time-left"> ({timeLeft})</span>
                    )}
                  </span>
                </p>
                <p><strong>Booked On:</strong> {formattedDate}</p>
                <p><strong>Price:</strong> ${pkg.price}</p>
                <p><strong>Tax (18%):</strong> ${(pkg.price * 0.18).toFixed(2)}</p>
                <p><strong>Total:</strong> ${(pkg.price * 1.18).toFixed(2)}</p>

                {/* Admin actions */}
                {roleID === 0 && pkg.status === "pending" && (
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(pkg.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(pkg.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {/* User payment button */}
                {roleID !== 0 && pkg.status === "approved" && timeLeft !== "Expired" && (
                  // <button
                  //   className="btn btn-primary btn-sm mt-2"
                  //   onClick={() => processPayment(pkg.id)}
                  // >
                  //   Pay Now
                  // </button>
                  <button 
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => processPayment(pkg)}
                  disabled={pkg.status !== "approved" || calculateTimeLeft(pkg.paymentDueDate) === "Expired"}
                  >
                    Pay Now
                  </button>
                  
                )}

                {/* Expired notice */}
                {pkg.status === "approved" && timeLeft === "Expired" && (
                  <div className="text-danger mt-2">
                    Payment window expired
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