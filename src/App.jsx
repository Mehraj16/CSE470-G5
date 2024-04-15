import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Info from './components/Info';
import MvvMode from './components/MvvMode';
import './App.css'

function App() {
  const [numEventsSignedUp, setNumEventsSignedUp] = useState(0);
  const [nearestEvent, setNearestEvent] = useState({});
  const [myevents, setmyevents] = useState([]);
  const [info, setInfo] = useState([]);
  const [chart, setChart] = useState([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [MVV, setMVV] = useState(false);

  const data = sessionStorage.getItem('profileData');
  const parsedData = JSON.parse(data);
  const mydata = parsedData

  useEffect(() => {
    const fetcheventData = async () => {
      let url = 'http://127.0.0.1:8000/api/events-signed-up/';
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
        const eventsArray = Object.values(responseBody);
        const filteredEvents = eventsArray.filter(event => event.volunteer_id === mydata.id);
        setmyevents(filteredEvents);

        const today = new Date().toISOString().slice(0, 10);
        let nearestEvent = null;
        let nearestDateDiff = null;
        let count = 0;
        for (const event of filteredEvents) {
          const eventDate = new Date(event.event_date);
          if (eventDate >= new Date(today)) {
            count+=1;
            const dateDiff = Math.abs(eventDate - new Date(today));
            if (nearestEvent === null || dateDiff < nearestDateDiff) {
              nearestEvent = event;
              nearestDateDiff = dateDiff;
            }
          }
        setNearestEvent(nearestEvent);
        }
        setNumEventsSignedUp(count)
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetcheventData();
  }, []);

  useEffect(() => {
    const fetchpartData = async () => {
        let url = 'http://127.0.0.1:8000/api/events/';
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
            if (responseBody && responseBody.length > 0) {
                const filteredEvents = responseBody.filter(event => event.id === nearestEvent.event_id);
                setChart(responseBody);
                setInfo(filteredEvents[0]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (nearestEvent.event_id) {
        fetchpartData();
    }
}, [nearestEvent]); // Adding nearestEvent to the dependency array

const is_mvv = localStorage.getItem('mvv');

useEffect(() => {
  if (is_mvv === 'true') {
    setMVV(true);
    const hasSeenMVVConfetti = localStorage.getItem('hasSeenMVVConfetti');
    if (hasSeenMVVConfetti === 'false' || hasSeenMVVConfetti === null) {
      setIsCelebrating(true);
      localStorage.setItem('hasSeenMVVConfetti', 'true');
      setTimeout(() => {
        setIsCelebrating(false);
      }, 4000);
    }
  }
}, [is_mvv]);

  return (
    <>
      <div className='App'>
      {MVV && isCelebrating && <Confetti
        style={{ width: "100vw",
        height: "100vh" }}
        numberOfPieces={200}
        gravity={0.5}
      />}
        <MvvMode />
        <Sidebar />
        <Header /> {/* Sends the profile image from fetched data */}
        <div className='Content'>
          <Info 
            data={mydata}
            totalEvents={numEventsSignedUp}
            nearestEvent={nearestEvent}
            info={info}
            chart={chart}
          />
        </div>
      </div>
    </>
  );
}

export default App;
