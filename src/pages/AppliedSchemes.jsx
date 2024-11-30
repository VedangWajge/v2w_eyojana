import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 
import './AppliedSchemes.css'; // Import the CSS file for styling

const AppliedSchemes = () => {
  const [pendingApplications, setPendingApplications] = useState([]); // State for pending applications
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schemes');
        const pending = response.data.filter(app => app.status === 'pending'); // Filter for pending schemes
        setPendingApplications(pending);
      } catch (error) {
        console.error('Error fetching pending applications:', error);
      }
    };

    fetchPendingApplications();
  }, []);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
    setShowModal(false);
  };

  return (
    <div className="applications-container">
      <h1>Pending Applications</h1>
      <div className="applications-grid">
        {pendingApplications.length > 0 ? (
          pendingApplications.map(app => (
            <div key={app._id} className="application-card">
              <h3>{app.schemename}</h3>
              <p>Status: {app.status}</p>
              <p>Category: {app.category}</p>
              <p>Email: {app.email}</p>
              <button onClick={() => handleViewDetails(app)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No pending applications found.</p>
        )}
      </div>
      {showModal && selectedApplication && (
        <Modal application={selectedApplication} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AppliedSchemes;

