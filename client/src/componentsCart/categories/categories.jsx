import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './categories.css';

import axios from 'axios';

const Categories = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = (categoryName) => {
    // Set the search value to the name of the clicked category
    setSearchValue(categoryName.value);

    axios
      .get(`http://localhost:3001/api/search?query=${categoryName}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const data = response.data;
        setFilterData(data);
        navigate('/cart/search', { state: { searchData: data } });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setError(
          'There was a problem with the fetch operation. Please try again later.'
        );
      });
  };

  return (
    <>
      <div className="header1">
        <h1>Shop by categories</h1>
      </div>
      <div className="cardall">
        <div className="cardContainer1">
          <h5
            className="cardTitle"
            onClick={() => handleSearch('vitamin')}
          >
            Vitamins
          </h5>
        </div>
        <div className="cardContainer2">
          <h5 onClick={() => handleSearch('Syringe')}>
            Syringes
          </h5>
        </div>
        <div className="cardContainer3">
          <h5 className="cardTitle" onClick={() => handleSearch('Tablet')}>
            Tablets
          </h5>
        </div>
        <div className="cardContainer4">
          <h5
            className="cardTitle"
            onClick={() => handleSearch('pain killer')}
          >
            Pain Relievers
          </h5>
        </div>
        <div className="cardContainer5">
          <h5 className="cardTitle" onClick={() => handleSearch('ORS')}>
            ORS
          </h5>
        </div>
      </div>
    </>
  );
};

export default Categories;
