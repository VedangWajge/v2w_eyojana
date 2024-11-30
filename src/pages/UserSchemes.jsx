import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import "./UserSchemes.css";
import EditForm from './EditForm';

const UserSchemes = () => {
    const { isLoggedIn, email } = useAuth(); 
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [schemes, setSchemes] = useState([]);
    const [filteredSchemes, setFilteredSchemes] = useState([]);
    const [showButton, setShowButton] = useState(false); 
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState(null);
  
    const [selectedDoc, setSelectedDoc] = useState(null);
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchSchemes = async () => {
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/schemes/${email}`);
                    setSchemes(response.data);
                    setFilteredSchemes(response.data); // Initialize filtered schemes
                } catch (error) {
                    console.error('Error fetching schemes:', error);
                    setError('Could not fetch schemes. Please try again later.');
                }
            }
        };

        fetchSchemes();
    }, [email]);

    // Filter schemes based on selected status
    const handleFilterChange = (status) => {
        setStatusFilter(status);
        if (status === 'All') {
            setFilteredSchemes(schemes);
            setShowButton(false);
        }
         
        else {
            const filtered = schemes.filter(scheme => scheme.status.trim().toLowerCase() === status.toLowerCase());
            console.log(`Filtering for status: ${status}, Found:`, filtered); 
            setFilteredSchemes(filtered);
            setShowButton(false);
        }
    };

    // const handleButtonClick = async (schemeId) => {
    //     console.log('Scheme ID being passed:', schemeId); // Add this to log the ID
    //     try {
    //         const response = await axios.get(`http://localhost:3000/api/schemes/${schemeId}`);
    //         console.log('Scheme data:', response.data); // Log the scheme data to ensure it's fetched correctly
    //         setFormData(response.data); 
    //         setIsFormOpen(true); 
    //     } catch (error) {
    //         console.error('Error fetching form data:', error);
    //     }
    // };
    
    const handleFormSubmit = async (updatedData) => {
        try {
            // Submit the updated data to the backend
            await axios.put(`/api/schemes/${formData.id}`, updatedData);
            console.log('Form updated successfully');
            setIsFormOpen(false); // Close the form modal
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };

    // const handleEdit = async (schemeId) => {
    //     try {
    //       const response = await axios.get(`http://localhost:5000/api/schemes/${schemeId}`);
    //       const schemeData = response.data;
    //       navigate("/edit-form", { state: { schemeData } });
    //     } catch (err) {
    //       console.error("Error fetching scheme data:", err);
    //     }
    //   };

      const handleEditClick = (schemeName, user_id, documents, _id) => {
        // Assuming you're using React Router's useNavigate hook for navigation
        navigate('/schemeform', { state: { schemeName, user_id, documents, _id } })
        
    };

    const handleDocumentClick = (docName) => {
        setSelectedDoc(docName); // Set the clicked document name
      };

    return (
        <div className="user-schemes-container">
            <h2>Your Applied Schemes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="filter-buttons">
                <button onClick={() => handleFilterChange('All')}>All</button>
                <button onClick={() => handleFilterChange('Approved')}>Approved</button>
                <button onClick={() => handleFilterChange('Pending')}>Pending</button>
                <button onClick={() => handleFilterChange('Rejected')}>Rejected</button>
                <button onClick={() => handleFilterChange('Reverted')}>Reverted</button>
            </div>
            {filteredSchemes.length > 0 ? (
                <div className="schemes-grid">
                    {filteredSchemes.map((scheme) => (
                        <div key={scheme._id} className="scheme-card">
                            <div className='schemenm'>
                            <h4>{scheme.schemename}</h4>
                            </div>
                            {/* <div className='schemedoc'>
                            <h5>Documents</h5>
                                <ul>
                                {scheme.documents.map(doc => (
                                    <li key={doc.document_name}>
                                    <p>{doc.document_name}</p>
                                    <img
                                        src={`http://localhost:5000/api/schemes/${scheme._id}/documents/${doc.document_name}`}
                                        alt={doc.document_name}
                                        style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                                        onClick={() => handleDocumentClick(doc.document_name)} 
                                    />
                                    </li>
                                ))}
                                </ul>

                            </div> */}
                            <div>
                            <p>Status: <span className={`status-${scheme.status.toLowerCase()}`}>{scheme.status}</span></p>
                            {scheme.status.trim().toLowerCase() === 'reverted' && (
                                <button onClick={() => handleEditClick(scheme.schemename, scheme.user_id, scheme.documents, scheme._id)}>Edit</button>
                            )}
                            </div>
                            {isFormOpen && formData && (
                                <EditForm 
                                    formData={formData} 
                                    onFormSubmit={handleFormSubmit} 
                                    onClose={() => setIsFormOpen(false)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No schemes found.</p>
            )}
        </div>
    );
};

export default UserSchemes;
