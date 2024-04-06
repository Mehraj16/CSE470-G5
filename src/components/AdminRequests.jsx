import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import requests from'../css/requests.module.css';

export default function AdminRequests({ onViewDetails, alldata}) {
    const[data, setData] = useState(alldata);
    useEffect(() => {
        console.log(data);
    }, [data]);

   const removeRequest = async(reqid, vol_id, admin_id, name) =>{
    try{
        const mes = `Ypur request for ${name} has been approved`
        console.log(mes)
        const requestData = {
          "admin_id": admin_id,
          "volunteer_id": vol_id,
          "Message": mes
        };
        const response = await fetch('http://127.0.0.1:8000/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        const responseBody = await response.json();
        if (!response.ok) {
          console.log(responseBody)
          throw new Error('Failed to send invitation for volunteer:');
        }
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/remove-requests/${reqid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            });
        
        const responseBody = await response.json();
        if (!response.ok) {
          console.log(responseBody);
          throw new Error('Failed to remove:');
        }
        }catch (error) {
        console.error('Error removing:', error);   
        }
      }catch (error) {
        console.error('Error sending notifs:', error);   
      }
   }
    useEffect(() => {
        setData(alldata);
    }, [alldata]);
    const handleAccept = async (reqid, id, vol_id, date, admin_id, name) => {
        console.log('Accept clicked for ID:', id);
        setData(prevData => prevData.map(item => {
            if (item.event.id === id) {
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
              throw new Error('Failed to send invitation for volunteer:', selectedItem);
            }
            removeRequest(reqid, vol_id, admin_id, name);
          }catch (error) {
            console.error('Error sending notifss:', error);   
          }
    };

    const handleReject = (reqid, id, vol_id, date, admin_id, name) => {
        console.log('Reject clicked for ID:', id);
        setData(prevData => prevData.map(item => {
            if (item.event.id === id) {
                return { ...item, status: 'rejected' };
            }
            return item;
        }));
        removeRequest(reqid, vol_id, admin_id, name);
    };

    return (
        <div className={requests.container}>
            <h3 className={requests.h3}>Pending Invitations:</h3>
            <div className={requests.row}>
                <span className={requests.column} id={requests.head}>Volunteer Name</span>
                <span className={requests.column} id={requests.head}>Title</span>
                <span className={requests.columnbtn} id={requests.head}>Action</span>
            </div>
            <div className={requests.fullTable}>
                {data.map(event => (
                    <div key={event.id} className={requests.row}>
                        <span className={requests.column}>{event.volunteer.firstName}</span>
                        <span className={requests.column}>{event.event.title}</span>
                        <span className={requests.columnbtn}>
                            <button onClick={() => onViewDetails(event.volunteer.id)}>View</button>
                            {event.status === 'accepted' ? (
                                <FaCheck className={requests.icon} />
                            ) : event.status === 'rejected' ? (
                                <RiCloseLine className={requests.icon} />
                            ) : (
                                <>
                                    <button onClick={() => handleAccept(event.request_id, event.event.id, event.volunteer_id, event.event.date, event.admin_id, event.event.title)}>Accept</button>
                                    <button onClick={() => handleReject(event.request_id, event.event.id, event.volunteer_id, event.event.date, event.admin_id, event.event.title)}>Reject</button>
                                </>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
