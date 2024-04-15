import React, { useState, useEffect } from 'react';
import header from '../css/header.module.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const id = mydata.id;

  useEffect(() => {
    const fetchanotherData = async () => {
      try {
        let url = `http://127.0.0.1:8000/api/notifications/${id}`;
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
        console.log(responseBody);
        setNotifications(responseBody);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchanotherData();
  }, []);

  return (
        <div>
        <h2 className={header.h2}>Notifications</h2>
        <div className={header.notifList}>
            {notifications.map((notification, index) => (
            <span key={index} className={header.notificationSpan}>
                <span>{index+1} | {notification.Message}</span>
                <br />
            </span>
            ))}
        </div>
        </div>
  );
}

export default Notifications;
