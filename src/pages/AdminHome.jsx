import React, { useState, useEffect } from 'react';
import '../App.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminInfo from '../components/AdminInfo';
import DoughnutChart from '../components/DoughnutChart';
import LineChart from '../components/LineChart';
import DoubleBarChart from '../components/DoubleBarChart';

function AdminHome() {
  const [numEventsSignedUp, setNumEventsSignedUp] = useState(0);
  const [nearestEvent, setNearestEvent] = useState({});
  const [userdata, setuserData] = useState([]);
  const [admindata, setadminData] = useState([]);
  const [myevents, setmyevents] = useState([]);
  const [allevents, setallevents] = useState([]);

  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;

useEffect(() => {
  const fetcheventData = async () => {
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
      const eventsArray = Object.values(responseBody);
      const filteredEvents = eventsArray.filter(event => event.admin_id === myid);
      setmyevents(filteredEvents);
      const OtherfilteredEvents = eventsArray.filter(event => event.admin_id !== myid);
      setallevents(OtherfilteredEvents)
      const today = new Date().toISOString().slice(0, 10);
      let nearestEvent = null;
      let nearestDateDiff = null;
      let count = 0;
      for (const event of filteredEvents) {
        const eventDate = new Date(event.date);
        if (eventDate >= new Date(today)) {
          count+=1;
          const dateDiff = Math.abs(eventDate - new Date(today));
          if (nearestEvent === null || dateDiff < nearestDateDiff) {
            nearestEvent = event;
            nearestDateDiff = dateDiff;
          }
        }
      setNearestEvent(nearestEvent);
      console.log(nearestEvent)
      }
      setNumEventsSignedUp(count)
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetcheventData();
}, []);

useEffect(() => {
  fetchadminData();
}, []);

const fetchadminData = async () => {
  let url;
  url = 'http://127.0.0.1:8000/api/admins';
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
        setadminData(responseBody);
    } catch (error) {
        console.error('Error:', error);
    }
};
useEffect(() => {
  fetchuserData();
}, []);

const fetchuserData = async () => {
  let url;
  url = 'http://127.0.0.1:8000/api/users';
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
        setuserData(responseBody);
    } catch (error) {
        console.error('Error:', error);
    }
};
  return (
    <>
      <div className='App'>
        <AdminSidebar />
        <AdminHeader /> {/* Sends the profile image from fetched data */}
        <div className='Content'>
          <AdminInfo 
            data={mydata}
            totalEvents={numEventsSignedUp}
            nearestEvent={nearestEvent}
            profilepic={mydata.profileImage}
          />
          <div>
          <div className='first-layer'>
            <DoughnutChart userdata={userdata} admindata={admindata}/>
            <DoubleBarChart userdata={userdata} admindata={admindata}/>
          </div>
          </div>
          <br />
          <br />
          <LineChart myevents={myevents} allevents={allevents}/>
          <br />
        </div>
      </div>
    </>
  );
}

export default AdminHome;
