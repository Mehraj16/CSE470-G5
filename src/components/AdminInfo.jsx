import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForwardCircle } from "react-icons/io5";
import '../css/info.css';

export default function AdminInfo(props) {

    const[count, setCount] = useState(0);
    const navigation = useNavigate();
    const showInvites = () => {
      navigation('../admininvites');
    };
    const showMyEvents = () => {
      navigation('../adminevents',{state: props.data});
    };
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
          if (responseBody.some(item => item.admin_id === props.data.id)) {
            const filteredData = responseBody.filter(item => item.admin_id === props.data.id);
            setCount(filteredData.length); // Set matchingData state with filtered data
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
    function formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      if(dateStr !== undefined && dateStr !== null)
          return date.toLocaleDateString('en-US', options);
    }
    function convertToAMPM(timeString) {
      
      if(timeString !== undefined && timeString !== null){
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        const ampmTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        return ampmTime;
      }
  }
  
  return (
    <div className="dashboard">
      <div className="welcomeText">
        <p>Welcome, {props.data.firstName}</p>
      </div>
      <div className="dashEvent">
        <div className="totalEvents">
          <p className='upcoming'>Upcoming Events</p>
          <p className='total'>{props.totalEvents}</p>
        </div>
        <div className='invitation' style={{paddingRight: '20px'}}>
          <div>
            <p className='upcoming'>Approval Pending</p><IoArrowForwardCircle className='showInvite' onClick={showInvites}/>
          </div>
          <p className='total'>{count}</p>
        </div>
        <div className="eventDetail">
          <div className="eventRoster">
            <p>Event Roster</p>
            <button className='detailbtn' onClick={showMyEvents}>Details</button>
          </div>
          <p>{formatDate(props.nearestEvent.date)} | {convertToAMPM(props.nearestEvent.time)}</p>
          <p>{props.nearestEvent.location}</p>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
