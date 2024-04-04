import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Info from './components/Info';
import './App.css'

function App() {
  const [profileData, setProfileData] = useState({});
  const [numEventsSignedUp, setNumEventsSignedUp] = useState(0);
  const [nearestEvent, setNearestEvent] = useState({});

  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const hasSeenConfetti = localStorage.getItem('hasSeenConfetti');
    if (!hasSeenConfetti) {
      setIsCelebrating(true);
      localStorage.setItem('hasSeenConfetti', 'true');
      setTimeout(() => {
        setIsCelebrating(false);
      }, 3000); // Stop celebrating after 3 seconds
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfileData(data);

        const { eventsSignedUp } = data;
  
        if (Array.isArray(eventsSignedUp)) {
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
      {isCelebrating && <Confetti
        width={1200}
        height={600}
        numberOfPieces={200}
        gravity={0.5}
      />}
        <Sidebar />
        <Header profilepic={`/src/assets/${profileData.profileImage}`} /> {/* Sends the profile image from fetched data */}
        <div className='Content'>
          <Info 
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
