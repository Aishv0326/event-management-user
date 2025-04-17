import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import "../src/css/Navbar.css";
import "../src/css/Home.css";
import "../src/css/Event.css";
import "../src/css/CategoryCarousel.css";
import "../src/css/EventModal.css";
import "../src/css/Categories.css";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Event from "./pages/Event";
import Category from "./pages/Categories";
import WelcomePage from "./pages/Welcome";
import Package from "./pages/PackagePage";
import BookedPackagesPage from "./pages/BookedPackagesPage";
import VenueListPage from "./pages/VenueListPage";
import ServicePricingPage from "./pages/ServicePricingPage";
import PackageDetailsPage  from "./pages/PackageDetailsPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";


const PrivateRoute = ({ element, requiredRoles = [] }) => {
  const userId = sessionStorage.getItem("userId");
  const roleID = parseInt(sessionStorage.getItem("roleID"));
  const isValidUser = userId && !isNaN(userId) && Number.isInteger(Number(userId));
  const isAuthorized = requiredRoles.length === 0 || requiredRoles.includes(roleID);

  if (!isValidUser) return <Navigate to="/login" />;
  if (!isAuthorized) return <Navigate to="/dashboard" />; // redirect to home
  

  return element;
};

function App() {
  return (
    <Router>
      <Routes>        
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/canceled" element={<PaymentCanceled />} />     

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
          <Route index element={<Home />} />
          <Route path="event" element={<PrivateRoute element={<Event />} />} />
          <Route path="package-details/:id" element={<PrivateRoute element={<PackageDetailsPage />} />} />          
          <Route path="booked-packages" element={<PrivateRoute element={<BookedPackagesPage />}/>} />
          <Route path="category" element={<PrivateRoute element={<Category />} requiredRoles={[0]} />} />
          <Route path="package" element={<PrivateRoute element={<Package />} requiredRoles={[0]} />} />
          <Route path="venues" element={<PrivateRoute element={<VenueListPage />} requiredRoles={[0]} />} />          
          <Route path="service-price" element={<PrivateRoute element={<ServicePricingPage />} requiredRoles={[0]} />} />   
           
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>    
  );
}

export default App;
