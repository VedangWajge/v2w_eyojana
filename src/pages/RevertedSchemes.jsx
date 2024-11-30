import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 
import './AppliedSchemes.css'; // Import the CSS file for styling

const RevertedSchemes = () => {
  const [revertedApplications, setRevertedApplications] = useState([]); // State for reverted applications
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRevertedApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schemes');
        const reverted = response.data.filter(app => app.status === 'reverted'); // Filter for reverted schemes
        setRevertedApplications(reverted);
      } catch (error) {
        console.error('Error fetching reverted applications:', error);
      }
    };

    fetchRevertedApplications();
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
      <h1>Reverted Applications</h1>
      <div className="applications-grid">
        {revertedApplications.length > 0 ? (
          revertedApplications.map(app => (
            <div key={app._id} className="application-card">
              <h3>{app.schemename}</h3>
              <p>Status: {app.status}</p>
              <p>Category: {app.category}</p>
              <p>Email: {app.email}</p>
              <button onClick={() => handleViewDetails(app)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No reverted applications found.</p>
        )}
      </div>
      {showModal && selectedApplication && (
        <Modal application={selectedApplication} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RevertedSchemes;
