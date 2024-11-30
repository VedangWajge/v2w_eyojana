import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate  } from 'react-router-dom';
import "./Category.css";
import { useAuth } from '../components/AuthContext'; 
const Category = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const csvFilePath = '/scraped_data.csv'; // Path relative to the public directory
    
    fetch(csvFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            console.log("Parsed Data:", result.data);
            const uniqueCategories = result.data.map(row => ({
              title: row.Text,
              link: row['Image Link'], // Use the actual link from the CSV
            }));
            setCategories(uniqueCategories);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV file:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card btn20" style={{ width: '17rem' }}>
                <img src={category.link} className="card-img-top" alt={category.title} style={{ height: '50px' }} />
                <div className="card-body">
                  <h5 className="card-title">{category.title}</h5>
                  <Link to={`/category/${encodeURIComponent(category.title)}`} className="btn23 btn-primary" >View Schemes</Link>
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );
}

export default Category;
