// src/components/AdminRatings.js
import React, { useState } from 'react';
import StarRating from './StarRating';

const AdminRatings = () => {
  const [volunteers, setVolunteers] = useState([
    // This would normally come from an API
    { id: 1, name: 'Volunteer 1', hours: 0, points: 0 },
    { id: 2, name: 'Volunteer 2', hours: 0, points: 0 },
    // ... other volunteers
  ]);

  const handleRating = (id, points) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, points } : volunteer
      )
    );
  };

  const handleHours = (id, hours) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === id ? { ...volunteer, hours, points: hours * volunteer.points } : volunteer
      )
    );
  };

  const handleSubmit = () => {
    console.log(volunteers);
    // Submit the ratings here, perhaps to an API
  };

  return (
    <div>
      <h1>Admin Ratings</h1>
      {volunteers.map((volunteer) => (
        <div key={volunteer.id}>
          <h2>{volunteer.name}</h2>
          <StarRating maxStars={5} onRating={(points) => handleRating(volunteer.id, points / 2)} />
          <input
            type="number"
            value={volunteer.hours}
            onChange={(e) => handleHours(volunteer.id, parseInt(e.target.value, 10))}
            placeholder="Enter hours"
          />
          <p>Points: {volunteer.points}</p>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Ratings</button>
    </div>
  );
};

export default AdminRatings;
