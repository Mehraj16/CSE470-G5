import React, { useState, useEffect } from 'react';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import AdminRequests from '../components/AdminRequests';
import AdminDetailedView from '../components/AdminDetailedView';
import { useLocation } from 'react-router-dom'

export default function AdminInvites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://127.0.0.1:8000/api/requests/';
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
        console.log(responseBody)
        if (responseBody.some(item => item.admin_id === myid)) {
          const filteredData = responseBody.filter(item => item.admin_id === myid);
          setData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const [allVolunteer, setAllVolunteer] = useState([]);

  const handleViewDetails = (eventId) => {
    const selectedEventData = allVolunteer.find(item => item.id === eventId);
    setSelectedData(selectedEventData);
    console.log(selectedData);
  };
  const [volunteer, setVolunteer] = useState([]);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://127.0.0.1:8000/api/users/';
        const volunteerResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const volunteerData = await volunteerResponse.json();
  
        if (!volunteerResponse.ok) {
          console.error('Failed request for volunteer data:', volunteerData);
          throw new Error('Failed request for volunteer data');
        }
        setAllVolunteer(volunteerData)
        const updatedVolunteerData = data.map(request => {
          const volunteer = volunteerData.find(volunteer => volunteer.id === request.volunteer_id);
          return { ...request, volunteer };
        });
  
        setVolunteer(updatedVolunteerData);

        url = 'http://127.0.0.1:8000/api/events/';
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
  
        const updatedEventData = updatedVolunteerData.map(request => {
          const event = eventData.find(event => event.id === request.event_id);
          return { ...request, event }; // Add event details to the request object
        });
  
        setEvent(updatedEventData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [data]); // Include data as a dependency if it's dynamic and might change


  return (
    <div className='App'>
      <Sidebar />
      <Header />
      <div className='profile-content'>
        <AdminRequests
          alldata={event}
          onViewDetails={handleViewDetails}
        />
        <AdminDetailedView
          firstName={selectedData?.firstName}
          lastName={selectedData?.lastName}
          total={selectedData?.eventCount}
          score={selectedData?.lifetimeScore}
          medals={selectedData?.totalMedals}
          skills={selectedData?.skills}
          interests={selectedData?.interests}
        />
      </div>
    </div>
  );
}
