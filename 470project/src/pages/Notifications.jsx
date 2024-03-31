import React, { useState, useEffect } from 'react';
import header from '../css/header.module.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/notifications.json');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
        <div>
        <h2 className={header.h2}>Notifications</h2>
        <div className={header.notifList}>
            {notifications.map((notification, index) => (
            <span key={index}>
                <img src={notification.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                <span>{notification.name} did {notification.message}</span>
                <br />
            </span>
            ))}
        </div>
        </div>
  );
}

export default Notifications;
