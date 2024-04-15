import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';
import requests from '../css/requests.module.css';

export default function Requests({ alldata, onViewDetails }) {
    const jsonString = sessionStorage.getItem('profileData');
    const mydata = JSON.parse(jsonString);
    const myid = mydata.id;
    const [data, setData] = useState([]);

    useEffect(() => {
      setData(alldata.map(item => ({ ...item, status: '' })));
    }, [alldata]);

    const handleAccept = async (id, vol_id, date, admin_id, invite_id) => {
    setData(prevData => prevData.map(item => {
      if (item.event_id === id) {
        return { ...item, status: 'accepted' };
      }
      return item;
  }));
    try{
        const requestData = {  
            "volunteer_id": vol_id,
            "event_id": id,
            "event_date": date,
            "admin_id": admin_id
        };
        const response = await fetch('http://127.0.0.1:8000/api/events-signed-up/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        const responseBody = await response.json();
        if (!response.ok) {
          console.log(responseBody)
          throw new Error('Failed to send');
        }
        console.log("worked");
        try{
            const id = invite_id;
            const response = await fetch(`http://127.0.0.1:8000/api/delete-invite/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });     
            const responseBody = await response.json();
            console.log(responseBody)
            if (!response.ok) {
              throw new Error('Failed to send');
            }
            console.log("deleted");
        }catch (error) {
                console.error('Error deleting:');   
            }
        }catch (error) {
        console.error('Error:', error);   
      }
  };

  const handleReject = (id) => {
    setData(prevData => prevData.map(item => {
      if (item.event_id === id) {
        return { ...item, status: 'rejected' };
      }
      return item;
    }));
  };

  return (
    <div className={requests.container}>
      <h3 className={requests.h3}>Pending Invitations:</h3>
      <div className={requests.row}>
        <span className={requests.column} id={requests.head} style={{flex:'auto'}}>Event ID</span>
        <span className={requests.column} id={requests.head} style={{flex:'auto'}}>Title</span>
        <span className={requests.columnbtn} id={requests.head} style={{flex:'auto'}}>Action</span>
      </div>
      <div className={requests.fullTable}>
        {data.map(event => (
          <div key={event.id} className={requests.row}>
            <span className={requests.column}>{event.event_id}</span>
            <span className={requests.column}>{event.event.title}</span>
            <span className={requests.columnbtn}>
              <button onClick={() => onViewDetails(event.event_id)}>View</button>
              {event.status === 'accepted' ? (
                <FaCheck className={requests.icon} />
              ) : event.status === 'rejected' ? (
                <RiCloseLine className={requests.icon} />
              ) : (
                <>
                  <button onClick={() => handleAccept(event.event.id, myid, event.event.date, event.admin_id, event.invite_id)}>Accept</button>
                  <button onClick={() => handleReject(event.event_id)}>Reject</button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
