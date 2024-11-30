import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './schemeform.css';

const SchemeForm = () => {  
  const location = useLocation();
  const navigate = useNavigate();
  const { schemeName, documents = [], user_id, _id } = location.state || {};

  const currentcategory = location.state?.currentcategory || "";
  const { email: authEmail } = useAuth(); 
  const [email, setEmail] = useState(authEmail);

  // New state to track if the application already exists
  const [isExistingApplication, setIsExistingApplication] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    const data = { email };
    const response = await axios.post("http://localhost:5000/api/sendemail", data);
    console.log(response.data);
  };

  const combinedSubmit = async (e) => {
    e.preventDefault(); 
    await handleSubmit(e);
    sendEmail(e);
  };

  const [formData, setFormData] = useState({
    schemename: schemeName || "",
    user_id: "",
    email: email || "", 
    status: "pending",
    category: currentcategory,
    documents: [], 
  });

  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/${email}`);
        if (response.data.user_id) {
          setFormData((prevData) => ({
            ...prevData,
            user_id: response.data.user_id, 
            documents: response.data.documents || [],
          }));
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Failed to fetch user ID."); 
      }
    };

    if (email) {
      fetchUserId(); 
    }
  }, [email, formData.schemename]);

  useEffect(() => {
    // Call checkExistingApplication when component mounts
    const checkExistingApplication = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/schemes/check", {
          email: formData.email,
          schemename: formData.schemename,
          documents: formData.documents,
        });
        setIsExistingApplication(res.data.exists); // Update state based on the result
      } catch (err) {
        console.error("Error checking existing application:", err);
        setError("Error checking existing application.");
      }
    };

    if (formData.schemename) {
      checkExistingApplication();
    }
  }, [formData.schemename, formData.email, formData.documents]); // Make sure to run this effect when schemename or email changes

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { name: "", file: null }],
    });
  };

  const handleDocumentChange = (index, e) => {
    const updatedDocuments = [...formData.documents];
    if (e.target.type === "file") {
      updatedDocuments[index].file = e.target.files[0]; 
    } else {
      updatedDocuments[index].name = e.target.value;
    }
    setFormData({ ...formData, documents: updatedDocuments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
  
    const data = new FormData();
    data.append("schemename", formData.schemename);
    data.append("user_id", formData.user_id); 
    data.append("email", formData.email);
    data.append("status", formData.status);
    data.append("category", formData.category);
    
    // Append documents to FormData
    formData.documents.forEach((document, index) => {
      if (document.file) {
        data.append("documents", document.file);
        data.append(`document_name_${index}`, document.name); 
      }
    });
  
    try {
      if (isExistingApplication) {
        // If the application already exists, send a PATCH request to update it
        const res = await axios.patch(`http://localhost:5000/api/schemes/update/${formData.user_id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", res.data);
        setSuccess("Application updated successfully!"); 
      } else {
        // If the application doesn't exist, send a POST request to submit a new application
        const res = await axios.post("http://localhost:5000/api/schemes", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", res.data);
        setSuccess("Application submitted successfully!");
      }
    } catch (err) {
      setError(err.response?.data.message || err.message);
      console.error("Error uploading files:", err);
    }
  };
  

  return (
    <form className="form1" onSubmit={combinedSubmit}>
      <div>
        <h2>Apply for {schemeName}</h2>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-group" style={{display: "none"}}>
        <label>User ID:</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input className="emailinput"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            handleInputChange(e);
            setEmail(e.target.value);
          }}
          required
          readOnly
        />
      </div>

      <h4>Documents:</h4>
      <ul>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li key={doc.document_name}>
              <p>{doc.document_name}</p>
              <img
                src={`http://localhost:5000/api/schemes/${_id}/documents/${doc.document_name}`}
                alt={doc.document_name}
                style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
              />
            </li>
          ))
        ) : (
          <p>No documents available</p>
        )}
      </ul>

      <h4>Upload New Documents:</h4>
      {formData.documents.map((document, index) => (
        <div key={index} className="document-input-group">
          <input
            type="text"
            placeholder="Document Name"
            value={document.name}
            onChange={(e) => handleDocumentChange(index, e)}
            required
          />
          <input
            type="file"
            onChange={(e) => handleDocumentChange(index, e)}
            required
          />
        </div>
      ))}

      <button type="button" className="buttons add-document-btn" onClick={addDocument}>
        Add Document
      </button>

      {/* Conditionally render Submit or Update button */}
      <button type="submit" className="buttons submit-btn">
        {isExistingApplication ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default SchemeForm;
