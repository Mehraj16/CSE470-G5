import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DetailedView from '../components/DetailedView';
import { useLocation } from 'react-router-dom';
import requests from '../css/requests.module.css';

export default function Invites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const location = useLocation();
  const props = location.state;

  useEffect(() => {
      const fetchData = async () => {
        let url = `http://127.0.0.1:8000/api/events-signed-with-id/${props.id}`;
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
            setData(responseBody)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchData();
  }, []);

  const handleViewDetails = (eventId) => {
    const selectedEventData = data.find(item => item.id === eventId);
    setSelectedData(selectedEventData);
  };

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={props.profilepic}/>
      <div className='profile-content'>
        <div className={requests.container}>
          <h3 className={requests.h3}>Upcoming Events:</h3>
            <div className={requests.row}>
                <span className={requests.column} id={requests.head3}>Date</span>
                <span className={requests.column} id={requests.head3}>Title</span>
                <span className={requests.columnbtn} id={requests.head3}>Action</span>
            </div>
        <div className={requests.fullTable}>
            {data.map(event => (
              <div key={event.id} className={requests.row}>
                <span className={requests.column} id={requests.head2}>{event.date}</span>
                <span className={requests.column} id={requests.head2}>{event.title}</span>
                <span className={requests.columnbtns} id={requests.head2}>
                  <button onClick={() => handleViewDetails(event.id)}>View</button>
                </span>
              </div>
            ))}
        </div>
        </div>
        <DetailedView 
          author={selectedData?.author}
          image={selectedData?.image}
          date={selectedData?.date}
          time={selectedData?.time}
          rewards={selectedData?.rewards}
          location={selectedData?.location}
        />
    </div>
    </div>
  );
}
