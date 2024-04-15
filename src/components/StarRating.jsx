import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa'; // Make sure to install react-icons
import rate from '../css/AdminRatings.module.css';

const StarRating = ({ maxStars, onRating }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (ratingValue) => {
    if (ratingValue === 2) {
      // If the clicked star is the first star
      if (rating === 2) {
        // If the rating is already 1, reset it to 0
        setRating(0);
        onRating(0);
      } else {
        // Otherwise, set the rating to 1
        setRating(2);
        onRating(2);
      }
    } else {
      // For other stars, update the rating as usual
      setRating(ratingValue);
      onRating(ratingValue);
    }
  };

  return (
    <div>
      {[...Array(maxStars)].map((_, index) => {
        const ratingValue = (index + 1) * 2;
        return (
          <label key={index} className={rate.starLabel}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              style={{ display: 'none' }} // Hide the radio button
              onChange={() => handleStarClick(ratingValue)}
            />
            <FaStar
              className={rate.star}
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={20}
              onClick={() => handleStarClick(ratingValue)} // Handle click on star directly
            />
          </label>
        );
      })}
    </div>
  );
};



StarRating.propTypes = {
  maxStars: PropTypes.number.isRequired,
  onRating: PropTypes.func.isRequired,
};

export default StarRating;
