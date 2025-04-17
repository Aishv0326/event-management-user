import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(location.search).get('session_id');

//   useEffect(() => {
//     if (sessionId) {
//       toast.success(`Payment successful! Session ID: ${sessionId}`);
//       // You can add additional logic here like verifying payment with your backend
//     } else {
//       navigate('/');
//     }
//   }, [sessionId, navigate]);
// In your PaymentSuccess.jsx
useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      if (sessionId) {
        const response = await fetch(`/api/Payment/verify?sessionId=${sessionId}`);
        if (response.ok) {
          toast.success("Payment confirmed!");
        }
      }
    };
    verifyPayment();
  }, []);
  return (
    <div className="container mt-5">
      <h2>Payment Successful!</h2>
      <p>Thank you for your payment.</p>
      {sessionId && <p className="text-muted">Reference: {sessionId}</p>}
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/dashboard')}
      >
        View Your Bookings
      </button>
    </div>
  );
}