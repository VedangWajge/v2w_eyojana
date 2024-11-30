import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 
import './AppliedSchemes.css'; // Import the CSS file for styling

const ApprovedSchemes = () => {
  const [approvedApplications, setApprovedApplications] = useState([]); // State for approved applications
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schemes');
        const approved = response.data.filter(app => app.status === 'approved'); // Filter for approved schemes
        setApprovedApplications(approved);
      } catch (error) {
        console.error('Error fetching approved applications:', error);
      }
    };

    fetchApprovedApplications();
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
      <h1>Approved Applications</h1>
      <div className="applications-grid">
        {approvedApplications.length > 0 ? (
          approvedApplications.map(app => (
            <div key={app._id} className="application-card">
              <h3>{app.schemename}</h3>
              <p>Status: {app.status}</p>
              <p>Category: {app.category}</p>
              <p>Email: {app.email}</p>
              <button onClick={() => handleViewDetails(app)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No approved applications found.</p>
        )}
      </div>
      {showModal && selectedApplication && (
        <Modal application={selectedApplication} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ApprovedSchemes;
