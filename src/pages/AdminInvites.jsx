import React, { useState, useEffect } from 'react';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import AdminRequests from '../components/AdminRequests';
import AdminDetailedView from '../components/AdminDetailedView';
import { useLocation } from 'react-router-dom'

export default function AdminInvites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const location = useLocation();
  const props = location.state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/someProfiles.json'); 
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
    console.log(selectedData);
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
        <AdminRequests
          data={data}
          onViewDetails={handleViewDetails}
          // onAccept={onAccept}
          // onReject={onReject}
        />
        <AdminDetailedView
          firstName={selectedData?.firstName}
          lastName={selectedData?.lastName}
          image={selectedData?.profileImage}
          total={selectedData?.eventCount}
          score={selectedData?.score}
          medals={selectedData?.totalMedals}
          skills={selectedData?.skills}
          interests={selectedData?.interests}
        />
      </div>
    </div>
  );
}
