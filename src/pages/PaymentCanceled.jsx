import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Payment Canceled</h2>
      <p>Your payment was not completed.</p>
      <div className="d-flex gap-2">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Bookings
        </button>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}