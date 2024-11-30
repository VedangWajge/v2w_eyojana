import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import { Link, useNavigate } from 'react-router-dom';
import "./schemedetails.css"
const SchemeDetail = () => {
  const location = useLocation();
  const { selectedItem, category } = location.state || {};
  
  const [csvData, setCsvData] = useState([]);
  const [matchingScheme, setMatchingScheme] = useState(null);

  // Single path to the CSV file
  const csvFilePath = '\document.csv';  // Update with actual path

  // Parse CSV file
  useEffect(() => {
    const parseCSV = (filePath) => {
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          // Find the matching scheme based on selectedItem
          const match = results.data.find(
            (scheme) => scheme.span_text === selectedItem
          );
          setMatchingScheme(match);
        },
        error: (error) => {
          console.error('Error loading CSV data:', error);
        },
      });
    };

    if (selectedItem) {
      parseCSV(csvFilePath);
    }
  }, [selectedItem]);

  return (
    <div className="container mt-4">
      {matchingScheme ? (
        <div>
          <h2><strong>{matchingScheme.span_text}</strong></h2>
          <br />
          <h4>Details:</h4><p>{matchingScheme.details_text}</p>
          <br />
          <h4>Benefits:</h4><p> {matchingScheme.benefit_text}</p>
          <br />
          <h4>Eligibility:</h4><p> {matchingScheme.eligibility_text}</p>
          <br />
          <h4>Documents Required:</h4><p> {matchingScheme.document}</p>
          <br />
        
           <Link className='button' to={"/schemeform"} state={{ schemeName: matchingScheme.span_text,currentcategory: category }} >Apply</Link>
        </div>
      ) : (
        <p>No scheme selected or details not available.</p>
      )}
    </div>
  );
};
// state={{ selectedItem: item }}
export default SchemeDetail;
