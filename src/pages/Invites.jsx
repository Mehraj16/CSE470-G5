import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Requests from '../components/Requests';
import DetailedView from '../components/DetailedView';
import { useLocation } from 'react-router-dom'

export default function Invites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const location = useLocation();
  const props = location.state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/invites.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleViewDetails = (eventId) => {
    // Find the data with the matching eventId
    const selectedEventData = data.find(item => item.id === eventId);
    setSelectedData(selectedEventData);
  };

  // const handleAccept = (eventId) => {
  //   setData(prevData => {
  //       return prevData.map(event => {
  //           if (event.id === eventId) {
  //               event.accepted = true;
  //           }
  //           return event;
  //       });
  //   });
  //   console.log(data);
  // };

  // const handleReject = (eventId) => {
  //   setData(prevData => {
  //       return prevData.map(event => {
  //           if (event.id === eventId) {
  //               event.accepted = false;
  //           }
  //           return event;
  //       });
  //   });
  // };

  return (
    <div className='App'>
      
      <Sidebar />
      <Header profilepic={`/src/assets/${props.profilepic}`}/>
      <div className='profile-content'>
        <Requests
          data={data}
          onViewDetails={handleViewDetails}
          // onAccept={onAccept}
          // onReject={onReject}
        />
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
