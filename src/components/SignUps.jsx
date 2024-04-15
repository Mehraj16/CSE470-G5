import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import { useLocation } from 'react-router-dom';
import requests from'../css/requests.module.css';
export default function SignUps() {
    const location = useLocation(); 
    const props = location.state;
    const[data, setData] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        let url = `http://127.0.0.1:8000/api/event-signups/${props.id}`;
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
                  setData(responseBody);
    
                } catch (error) {
                    console.error('Error:', error);
                }  
      };

  return (
    <div className='App'>
        <AdminHeader />
        <AdminSidebar />
        <div className='Content'>
        <h3>Volunteers who signed up for: {props.title}</h3>
        <div key={props.id} className={requests.eventContainer} style={{ width: '60vw' }}>
        <div className={requests.row}>
            <span className={requests.column} id={requests.head}>ID</span>
            <span className={requests.column} id={requests.head}>Name</span>
            <span className={requests.columnbtn} id={requests.head}>Email</span>
        </div>
        {data.volunteers && data.volunteers.map((vol) => (
            <div vol={vol.id} className={requests.row}>
                <span className={requests.column}>{vol.id}</span>
                <span className={requests.column}>{vol.firstName}</span>
                <span className={requests.column}>{vol.email}</span>
            </div>
        ))}
        </div>

    </div>
    </div>
  );
}
