import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Requests from '../components/Requests';
import DetailedView from '../components/DetailedView';
import { useLocation } from 'react-router-dom';

export default function Invites() {
  const [inv, setInv] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = jsonString ? JSON.parse(jsonString) : null; // Check if jsonString is null
  const myid = mydata ? mydata.id : null; // Make sure mydata is not null
  const location = useLocation();
  const props = location.state;
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!myid) return; // If myid is null, don't fetch data
        let url = 'http://127.0.0.1:8000/api/invitations/';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseBody = await response.json();
        if (!response.ok) {
          console.error('Failed request:', responseBody);
          throw new Error('Failed request');
        }
        const filteredData = responseBody.filter(item => item.volunteer_id === myid);
        setInv(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [myid]);

  const handleViewDetails = (eventId) => {
    const selectedEventData = event.find(item => item.event_id === eventId);
    setSelectedData(selectedEventData);
  };

  useEffect(() => {
    const fetcheventData = async () => {
      try {
        const url = 'http://127.0.0.1:8000/api/events/';
        const eventResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const eventData = await eventResponse.json();
  
        if (!eventResponse.ok) {
          console.error('Failed request for event data:', eventData);
          throw new Error('Failed request for event data');
        }
        const updatedEventData = inv.map(request => {
          const event = eventData.find(event => event.id === request.event_id);
          return { ...request, event };
        });
        setEvent(updatedEventData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }; 
    fetcheventData();
  }, [inv]);

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${props.profilepic}`} />
      <div className='profile-content'>
        <Requests
          alldata={event}
          onViewDetails={handleViewDetails}
        />
        <DetailedView
          author={selectedData?.event.title}
          image={selectedData?.image}
          date={selectedData?.event.date}
          time={selectedData?.event.time}
          rewards={selectedData?.event.rewards}
          location={selectedData?.event.location}
          description={selectedData?.event.description}
        />
      </div>
    </div>
  );
}
