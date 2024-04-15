import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StarRating from './StarRating';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import rate from '../css/AdminRatings.module.css';
import requests from'../css/requests.module.css';
import Pagination from '../components/Pagination';

const AdminRatings = () => {
  const location = useLocation();
  const props = location.state;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;
  const [eventClicked, setEventClicked] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState([]);
  const [hours, setHours] = useState(0);
  const [pointsMap, setPointsMap] = useState({}); 
  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [isVisible, setIsVisible] = useState(false);  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let url = `http://127.0.0.1:8000/api/past-dates/${props.id}`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseBody = await response.json(); // Read response body
            if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
              setEvents(responseBody)
              setTotalItems(responseBody.length);
            } catch (error) {
                console.error('Error:', error);
            }  
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageData = events.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleHours = (e) => {
    setHours(parseInt(e.target.value));
  };
  const handleRating = (eventId, volunteerId, ratingPoints) => {
    const totalPoints = ratingPoints * hours;
    setPointsMap(prevPointsMap => ({
      ...prevPointsMap,
      [eventId]: {
        ...prevPointsMap[eventId],
        [volunteerId]: totalPoints // Store points for each volunteer ID under each event ID
      }
    }));
    console.log(pointsMap);
  };
 
  const handleSubmit = async (eventId) => {
    const volunteer_ids_points = {};
  
  // Check if the event ID exists in pointsMap
  if (eventId in pointsMap) {
    for (const volunteerId in pointsMap[eventId]) {
      const points = pointsMap[eventId][volunteerId];
      volunteer_ids_points[volunteerId] = points;
    }
  }
  console.log('Volunteer IDs and Points:', volunteer_ids_points);
    let url = `http://127.0.0.1:8000/api/update_lifetime_score_and_move/${eventId}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(volunteer_ids_points)
      });
      const responseBody = await response.json(); // Read response body
          if (!response.ok) {
                  setAlert("Oops! Something went wrong!");
                  setAlertColor('#f45050');
                  throw new Error('Failed request');
              }
              console.log(responseBody)
              setAlert("Score Updated Successfully");
          } catch (error) {
              setAlert("Oops! Something went wrong!");
              setAlertColor('#f45050');
              console.error('Error:', error);
          }
  };
  const handleEventClick = (e, eventData) => {
    const eventToDisplay = events.filter(item=>item.event_id === eventData.event_id);
    setCurrentEvent(eventToDisplay);
    setEventClicked(true); 
  };

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
        setIsVisible(false);
        setAlert("");
        setAlertColor("");
    }, 2000);
    return () => clearTimeout(timer);
}, [alert]);

  return (
    <div className='App'>
      <AdminHeader alert={alert} isVisible={isVisible} alertColor={alertColor}/>
      <AdminSidebar />
      <div className='Content'>
      <h2>Events</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div key={props.id} className={requests.eventContainer}>
          <div className={requests.row}>
            <span className={requests.column} id={requests.head}>Event ID</span>
            <span className={requests.column} id={requests.head}>Event Name</span>
            <span className={requests.columnbtn} id={requests.head}>Review</span>
          </div>
            {currentPageData.map((item) => (
              <div key={item.event_id} className={requests.row}>
                <span className={requests.column}>{item.event_id}</span>
                <span className={requests.column}>{item.event_name}</span>
                <span className={requests.columnbtn}><button onClick={(e) => handleEventClick(e, item)}>Select</button></span>
              </div>
            ))}
        </div>
      
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      {eventClicked && currentEvent.map(event => (
          <React.Fragment>
            <h3>Rate volunteers for : {event.event_name}</h3>
            <div className={rate.hourDiv}>
              <input
                type="number"
                name="totalhrs"
                value={hours}
                onChange={handleHours}
                placeholder="Enter hours"
                className={rate.hoursInput}
              />
              <p>Hours</p>
            </div>
            <div className={rate.volunteersContainer}>
              <div className={rate.header}>
                <span>Volunteer Name</span>
                <span>Rating</span>
                <span>Points</span>
              </div>
              {event.volunteers.map(volunteer => (
                <div key={volunteer.id} className={rate.volunteerItem}>
                <span>{volunteer.firstName}</span>
                <div className={rate.starDiv}>
                  <StarRating maxStars={5} onRating={(points) => handleRating(event.event_id, volunteer.id, points)} />
                </div>
                <span>{pointsMap[event.event_id]?.[volunteer.id] || 0}</span>
              </div>
              ))}
            </div>
            <button onClick={() => handleSubmit(event.event_id)}>Submit Ratings</button>
            <br />
            <br />
          </React.Fragment>
      ))}
      </div>
    </div>
  );
};

export default AdminRatings;
