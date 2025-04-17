import { useEffect, useState } from "react";
import ServicePricingModal from "./ServicePricingModal";
import { toast } from "react-toastify";

const ServicePricingPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5086/api/ServicePricing");
      if (!res.ok) {
        throw new Error("Failed to load services");
      }
      
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      
      // Handle both array response and wrapped response formats
      if (Array.isArray(data)) {
        setServices(data);
      } else if (data.data && Array.isArray(data.data)) {
        setServices(data.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
      setServices([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
  
    try {
      const res = await fetch(`http://localhost:5086/api/ServicePricing/delete/${id}`, {
        method: "DELETE",
      });
  
      const text = await res.text();
      const result = text ? JSON.parse(text) : {};
  
      if (!res.ok) {
        throw new Error(result.message || "Failed to delete");
      }
  
      toast.success(result.message || "Service deleted!");
      fetchServices();
    } catch (err) {
      toast.error(err.message || "Error deleting service");
      console.error(err);
    }
  };
  const openAddModal = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Service Pricing</h3>
      <button className="btn btn-success mb-3" onClick={openAddModal}>
        + Add Service
      </button>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Service Name</th>
            <th>Price ($)</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service, index) => (
              <tr key={service.id}>
                <td>{index + 1}</td>
                <td>{service.serviceName}</td>
                <td>{service.price}</td>
                <td>{service.description}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => openEditModal(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <ServicePricingModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editingService={editingService}
        refreshServices={fetchServices}
      />
    </div>
  );
};

export default ServicePricingPage;
