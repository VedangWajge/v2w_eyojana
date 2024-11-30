import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import "./CategoryDetail.css"
const CategoryDetail = () => {

  const navigate = useNavigate();
  const { category } = useParams(); 
  const [items, setItems] = useState([]);
  const { isLoggedIn } = useAuth();
  const handleMoreInfoClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();  
      navigate('/login'); 
    }};
  useEffect(() => {
    const csvFilePath = '/scraped_texts.csv';

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
            console.log("CSV Data:", result.data);
            console.log("Category Parameter:", category);

            const normalizedCategory = category.toLowerCase().replace(/-/g, ' ').trim();

            // Filter and map the data based on the selected category
            const filteredItems = result.data
              .filter(row => row.p_text.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedCategory)
              .map(row => row.span_text);

            console.log("Filtered Items:", filteredItems);
            setItems(filteredItems);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching and parsing CSV file:', error);
      });
  }, [category]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{category.replace(/-/g, ' ').toUpperCase()}</h2>
      <ul className="list-group">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li className="list-group-item scheme " key={index}>
              <div className="scheme_name">{item}</div>
              <Link 
                to="/schemedetail" 
                state={{ selectedItem: item, category: category.replace(/-/g, ' ').toUpperCase() }}  // Pass the selected item
                className="detail btn-primary"
                onClick={handleMoreInfoClick} 
              >
                More Info
              </Link>
            </li>
          ))
        ) : (
          <p>No items found for this category.</p>
        )}
      </ul>
    </div>
  );
}

export default CategoryDetail;
