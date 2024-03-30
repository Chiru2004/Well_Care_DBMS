import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

function Searchbox() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    axios.get(`http://localhost:3001/api/search?query=${searchValue}`)
      .then((response) => {
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        // Extract data from the response
        const data = response.data;
        // Navigate to the next page and pass search data
        navigate("/cart/search", { state: { searchData: data } });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(
          "There was a problem with the fetch operation. Please try again later."
        );
      });
  };

  return (
    <div className="header">
      <div className="headerContainer">
        <div className="headerSearch">
          <FontAwesomeIcon icon={faCapsules} className="headerIcon" />
          <div className="headerSearchItem">
            <input
              id="searchInput"
              type="text"
              className="length"
              placeholder="search for  medicines"
              value={searchValue}
              onChange={handleInputChange}
            />
          </div>
          <button className="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Searchbox;
