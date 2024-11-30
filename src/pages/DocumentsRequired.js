import React, { useState } from 'react';
import './DocumentsRequired.css'; // Styling file

const DocumentsRequired = () => {
  const [formData, setFormData] = useState({
    identityProofType: '',
    identityProofFile: null,
    identityProofPreview: '',
    photo: null,
    photoPreview: '',
    casteCertificateFile: null,
    casteCertificatePreview: '',
    incomeCertificateFile: null,
    incomeCertificatePreview: '',
    additionalDocuments: [], // Array to store multiple additional documents
  });

  const [additionalDocumentFields, setAdditionalDocumentFields] = useState([
    { type: '', file: null, preview: '' }
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      let previewUrl = '';
      // For PDF files, no preview (could use a PDF icon)
      if (file.type === 'application/pdf') {
        previewUrl = 'pdf-icon'; // You can replace this with an actual image URL for a PDF icon
      } else {
        previewUrl = URL.createObjectURL(file); // For image preview
      }

      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: previewUrl,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAdditionalDocumentChange = (index, field, value) => {
    const newFields = [...additionalDocumentFields];

    if (field === 'file') {
      const file = value;
      let previewUrl = '';

      if (file.type === 'application/pdf') {
        previewUrl = 'pdf-icon'; // PDF preview icon
      } else {
        previewUrl = URL.createObjectURL(file); // For image preview
      }

      newFields[index][field] = file;
      newFields[index]['preview'] = previewUrl;
    } else {
      newFields[index][field] = value;
    }

    setAdditionalDocumentFields(newFields);
  };

  const handleAddMoreDocuments = () => {
    setAdditionalDocumentFields([...additionalDocumentFields, { type: '', file: null, preview: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, the formData and additionalDocumentFields will be submitted
    console.log({
      ...formData,
      additionalDocuments: additionalDocumentFields,
    });
    // Logic to submit the form data to the backend or handle it appropriately
  };

  return (
    <div className="form-container">
      <h2>Applying for the Scheme</h2>
      <form className="document-form" onSubmit={handleSubmit}>
        
        {/* Identity Proof Dropdown */}
        <label>
          Identity Proof:
          <select
            name="identityProofType"
            value={formData.identityProofType}
            onChange={handleChange}
            required
          >
            <option value="">Select an Identity Proof</option>
            <option value="Aadhar">Aadhar</option>
            <option value="PAN Card">PAN Card</option>
            <option value="Passport">Passport</option>
          </select>
        </label>

        {/* File upload for Identity Proof (Image or PDF) */}
        <label>
          Upload Identity Proof (Image or PDF):
          <input
            type="file"
            name="identityProofFile"
            accept="image/*,application/pdf"
            onChange={handleChange}
            required
          />
          {formData.identityProofPreview && formData.identityProofPreview !== 'pdf-icon' && (
            <img src={formData.identityProofPreview} alt="Identity Proof Preview" style={{ width: '100px' }} />
          )}
          {formData.identityProofPreview === 'pdf-icon' && (
            <div><span>PDF Uploaded: {formData.identityProofFile.name}</span></div>
          )}
        </label>

        {/* Photo of the applicant */}
        <label>
          Photo of the applicant:
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
          />
          {formData.photoPreview && (
            <img src={formData.photoPreview} alt="Applicant Photo Preview" style={{ width: '100px' }} />
          )}
        </label>

        {/* Caste Certificate File Upload (Image or PDF) */}
        <label>
          Upload Caste Certificate (Image or PDF):
          <input
            type="file"
            name="casteCertificateFile"
            accept="image/*,application/pdf"
            onChange={handleChange}
            required
          />
          {formData.casteCertificatePreview && formData.casteCertificatePreview !== 'pdf-icon' && (
            <img src={formData.casteCertificatePreview} alt="Caste Certificate Preview" style={{ width: '100px' }} />
          )}
          {formData.casteCertificatePreview === 'pdf-icon' && (
            <div><span>PDF Uploaded: {formData.casteCertificateFile.name}</span></div>
          )}
        </label>

        {/* Income Certificate File Upload (Image or PDF) */}
        <label>
          Upload Income Certificate (Image or PDF):
          <input
            type="file"
            name="incomeCertificateFile"
            accept="image/*,application/pdf"
            onChange={handleChange}
            required
          />
          {formData.incomeCertificatePreview && formData.incomeCertificatePreview !== 'pdf-icon' && (
            <img src={formData.incomeCertificatePreview} alt="Income Certificate Preview" style={{ width: '100px' }} />
          )}
          {formData.incomeCertificatePreview === 'pdf-icon' && (
            <div><span>PDF Uploaded: {formData.incomeCertificateFile.name}</span></div>
          )}
        </label>

        {/* Additional Documents Section */}
        <h3>Additional Documents</h3>
        {additionalDocumentFields.map((field, index) => (
          <div key={index} className="additional-document-group">
            <label>
              Additional Document {index + 1}:
              <select
                value={field.type}
                onChange={(e) =>
                  handleAdditionalDocumentChange(index, 'type', e.target.value)
                }
                required
              >
                <option value="">Select an Additional Document</option>
                <option value="Ration Card">Ration Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving License">Driving License</option>
                <option value="Employment Card">Employment Card</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Domicile Certificate">Domicile Certificate</option>
                <option value="Disability Certificate">Disability Certificate</option>
              </select>
            </label>

            {/* File upload for Additional Document (Image or PDF) */}
            <label>
              Upload {field.type} (Image or PDF):
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleAdditionalDocumentChange(index, 'file', e.target.files[0])
                }
                required
              />
              {field.preview && field.preview !== 'pdf-icon' && (
                <img src={field.preview} alt={`${field.type} Preview`} style={{ width: '100px' }} />
              )}
              {field.preview === 'pdf-icon' && (
                <div><span>PDF Uploaded: {field.file.name}</span></div>
              )}
            </label>
          </div>
        ))}

        <button type="button" onClick={handleAddMoreDocuments}>
          Add Another Document
        </button>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DocumentsRequired;
