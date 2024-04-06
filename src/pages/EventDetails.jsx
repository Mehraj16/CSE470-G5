import React , { useState, useEffect }from 'react';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../css/details.css';
import Details from '../components/Details';
import { useLocation } from 'react-router-dom'


export default function EventDetails () {

  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const location = useLocation();
  const props = location.state;
  const jsonString = localStorage.getItem('profileData');
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
        console.log(responseBody)
        if (responseBody.some(item => item.event_id === props.id)) {
            console.log("found")
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
        console.log(responseBody)
        if (responseBody.some(item => item.event_id === props.id)) {
            console.log("found")
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
        "admin_id": data.adminid,
        "event_id": data.eventid,
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
              console.log("posted");
            } catch (error) {
                console.error('Error:', error);
            }
    setIsClicked(true);
  };
  return (
    <div className='App'>
      
      <Sidebar />
      <Header />
      <div className='Content'>
        <Details title={props.title} date={props.date} time={props.time} location={props.location} description={props.description} image={props.banner_image} adminid={props.admin_id} eventid={props.id} isClicked={isClicked} handleClick={handleClick} status={status} isDisabled={isDisabled}/>
      </div>
    </div>
  )
}
