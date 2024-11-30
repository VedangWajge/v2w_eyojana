// EditScheme.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const location = useLocation();
    const { schemename, user_id, documents, _id } = location.state || {}; // Destructure data from location state
    const [newDocument, setNewDocument] = useState(null); // Store the new document file
    const [newDocuments, setNewDocuments] = useState(Array(documents.length).fill(null)); // Store new document files

    const [userEmail, setUserEmail] = useState(''); // Store the user email
    const [documentList, setDocumentList] = useState(documents || []); // Store documents

    useEffect(() => {
        // Fetch the user's email or get it from context
        const fetchUserEmail = async () => {
            // Replace this with actual email fetching logic
            const email = "user@example.com"; // Example email, replace with actual logic
            setUserEmail(email);
        };

        fetchUserEmail();
    }, []);

    const handleFileChange = (index, e) => {
        const file = e.target.files[0]; // Access the file from the event target
        const updatedNewDocuments = [...newDocuments];
        updatedNewDocuments[index] = file; // Store the new file for this index
        setNewDocuments(updatedNewDocuments);
    };

    const handleDocumentChange = (index, value) => {
        const updatedDocuments = [...documentList];
        updatedDocuments[index].document_name = value; // Update the specific document name
        setDocumentList(updatedDocuments);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Submit the updated data to the backend
            await axios.patch(`http://localhost:5000/api/schemes/${_id}`, {
                user_email: userEmail,
                documents: documentList,
            });
            alert('Scheme updated successfully');
            // Optionally redirect back to the user schemes page or do something else
        } catch (error) {
            console.error('Error updating scheme:', error);
        }
    };

    return (
        <div className="edit-scheme">
            <h3>Edit Scheme: {schemename}</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input type="text" value={userEmail} readOnly />
                </div>
                <div>
                    <label>Documents:</label>
                    {documentList.length > 0 ? (
                        <ul>
                            {documentList.map((doc, index) => (
                                <li key={index}>
                                    <img
                                        src={`http://localhost:5000/api/schemes/${_id}/documents/${doc.document_name}`}
                                        alt={doc.document_name}
                                        style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={doc.document_name}
                                        onChange={(e) => handleDocumentChange(index, e.target.value)}
                                        placeholder="Document name"
                                    />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(index, e)} // Update new document for this index
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No documents available.</p>
                    )}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditForm;
