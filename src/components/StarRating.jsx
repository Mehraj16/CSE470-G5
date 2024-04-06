// src/components/StarRating.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa'; // Make sure to install react-icons

const StarRating = ({ maxStars, onRating }) => {
  const [rating, setRating] = useState(0);

  return (
    <div>
      {[...Array(maxStars)].map((star, index) => {
        const ratingValue = (index + 1) * 2; // Each star is worth 2 points

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => {
                setRating(ratingValue);
                onRating(ratingValue);
              }}
            />
            <FaStar
              className="star"
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={20}
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
