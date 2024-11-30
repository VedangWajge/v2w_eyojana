import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css'; 
import { sendRevertEmail } from './statusEmail'; 

const Modal = ({ application, onClose }) => {
  const [status, setStatus] = useState(application.status);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showRevertMessage, setShowRevertMessage] = useState(false); 
  const [revertMessage, setRevertMessage] = useState('');
  useEffect(() => {
    const fetchUserDetails = async (email) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/email`, {
          params: { email }, 
        });
        console.log('User details:', response.data);
        setUserDetails(response.data); 
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (application.email) { 
      fetchUserDetails(application.email); 
    }
  }, [application.email]);

  const handleUpdateStatus = async () => {
    try {
      const data = { status };
  
      if (status === 'reverted') {
        data.revertMessage = revertMessage; 
      }
      await axios.patch(
        `http://localhost:5000/api/schemes/update-status/${application.email}/${application.schemename}`,
        data
      );

      const subject = `Your application status for ${application.schemename} has been updated`;
      let message = `Your application for ${application.schemename} has been ${status}.`;
  
      if (status === 'reverted') {
        message = `Your application for ${application.schemename} has been reverted with the following reason: ${revertMessage}`;
      }
  
      if (status === 'approved') {
        message = `Your application for ${application.schemename} has been: ${status}`;
      }
      if (status === 'rejected') {
        message = `Your application for ${application.schemename} has been : ${status}`;
      }
      const emailSent = await sendRevertEmail(application.email, message);
      if (emailSent) {
        alert('Email sent successfully');
      } else {
        alert('Failed to send email');
      }
  
      alert('Status updated successfully');       
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  

  const handleDocumentClick = (docName) => {
    setSelectedDoc(docName); 
  };

  const closeDocumentViewer = () => {
    setSelectedDoc(null);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setShowRevertMessage(newStatus === 'reverted'); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content1">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{application.schemename}</h2>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Category:</strong> {application.category}</p>

        {userDetails && (
          <>
            <h3>User Details:</h3>
            <p><strong>Name:</strong> {userDetails.username}</p> 
            <p><strong>State:</strong> {userDetails.state}</p>
            <p><strong>Gender:</strong> {userDetails.gender}</p>
          </>
        )}

        <h3>Documents</h3>
        <ul>
          {application.documents.map(doc => (
            <li key={doc.document_name}>
              <p>{doc.document_name}</p>
              <img
                src={`http://localhost:5000/api/schemes/${application._id}/documents/${doc.document_name}`}
                alt={doc.document_name}
                style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                onClick={() => handleDocumentClick(doc.document_name)} 
              />
            </li>
          ))}
        </ul>

        <h3>Update Status</h3>
        <select value={status} onChange={handleStatusChange}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="reverted">Reverted</option>
        </select>

        {showRevertMessage && (
          <div className="revert-message">
            <h4>Reason for Reversion:</h4>
            <textarea
              value={revertMessage}
              onChange={(e) => setRevertMessage(e.target.value)}
              placeholder="Enter the reason for reversion..."
              rows={4}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <button className="update-button" onClick={handleUpdateStatus}>Update Status</button>
      </div>
      {selectedDoc && (
        <div className="document-viewer-overlay" onClick={closeDocumentViewer}>
          <div className="document-viewer-content" onClick={e => e.stopPropagation()}>
            <h3>{selectedDoc}</h3>
            <img
              src={`http://localhost:5000/api/schemes/${application._id}/documents/${selectedDoc}`}
              alt={selectedDoc}
              style={{ maxWidth: '90%', maxHeight: '90%' }}
            />
            <button className="close-button" onClick={closeDocumentViewer}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
