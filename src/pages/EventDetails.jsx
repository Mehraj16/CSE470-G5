import React , { useState, useEffect }from 'react';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../css/details.css';
import { useLocation } from 'react-router-dom'


export default function EventDetails () {

  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const location = useLocation();
  const props = location.state;
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;
  const myemail = mydata.email;

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

        if (responseBody.some(item => item.event_id === props.id && item.volunteer_id === myid)) {
            console.log("found here", props.id);
            setStatus(true);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchanotherData = async () => {
      try {
        let url = 'http://127.0.0.1:8000/api/events-signed-up/';
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
        if (responseBody.some(item => item.event_id === props.id && item.volunteer_id === myid)) {
            console.log("found", props.id, item.event_id);
            setStatus(true);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchanotherData();
  }, []);

  const handleClick = async (data) => {
    console.log(data)
    const requestBody = {
        "admin_id": data.admin_id,
        "event_id": data.id,
        "volunteer_id": myid,
        "volunteer_email": myemail
    }
    console.log(requestBody)
    let url = 'http://127.0.0.1:8000/api/requests/';
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        const responseBody = await response.json(); // Read response body
            if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
              setIsClicked(true);
              setStatus(true);
            } catch (error) {
                console.error('Error:', error);
            }

  };
  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <div className='App'> 
      <Sidebar />
      <Header />
      <div className='Content'>
        <div className='banner'>
        <img src={props.banner_image} alt="eventBanner" />
        <p>Event Title</p>
        <p>{props.title}</p>
        <p>Event Time</p>
        <p>{formatDate(props.date)} {props.time}</p>
        <p>Event Location</p>
        <p>{props.location}</p>
        <p>Event Details</p>
        <p>{props.description}</p>
        <button
          className={`interestBtn ${isClicked ? 'active' : ''}`}
          onClick={(e) => handleClick(props)}
          disabled={isDisabled || status}>
          {status ? 'Interest Sent' : (isClicked ? 'Interest Sent' : 'Interested')}
        </button>
      </div>
      </div>
    </div>
  )
}
