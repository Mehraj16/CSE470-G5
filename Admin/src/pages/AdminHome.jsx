import React, { useState, useEffect } from 'react';
import '../App.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminInfo from '../components/AdminInfo';

function App() {
  const [profileData, setProfileData] = useState({});
  const [numEventsSignedUp, setNumEventsSignedUp] = useState(0);
  const [nearestEvent, setNearestEvent] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json');// test file used in public folder
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfileData(data);

        // Extracting profile data
        const { eventsSignedUp } = data;
  
        if (Array.isArray(eventsSignedUp)) {//this block chooses the latest event out of of the events signed up for
          const today = new Date().toISOString().slice(0, 10);
          let nearestEvent = null;
          let nearestDateDiff = null;
  
          for (const event of eventsSignedUp) {
            const eventDate = new Date(event.date);
            const dateDiff = Math.abs(eventDate - new Date(today));
  
            if (nearestEvent === null || dateDiff < nearestDateDiff) {
              nearestEvent = event;
              nearestDateDiff = dateDiff;
            }
          }
  
          setNearestEvent(nearestEvent); //info regarding the earliest upcoming event
          setNumEventsSignedUp(eventsSignedUp.length);
        } else {
          console.error('eventsSignedUp is not an array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <>
      <div className='App'>
        <AdminSidebar />
        <AdminHeader profilepic={`/src/assets/${profileData.profileImage}`} /> {/* Sends the profile image from fetched data */}
        <div className='Content'>
          <AdminInfo 
            firstName={profileData.firstName}
            totalEvents={numEventsSignedUp}
            nearestEvent={nearestEvent}
            profilepic={profileData.profileImage}
          />
        </div>
      </div>
    </>
  );
}

export default App;
