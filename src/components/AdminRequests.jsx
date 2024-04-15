import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import requests from'../css/requests.module.css';

export default function AdminRequests({ onViewDetails, alldata}) {
    const[data, setData] = useState(alldata);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const removeRequest = async (reqid, vol_id, admin_id, name, val) => {
      try {
        const mes = `Your request for ${name} has been approved`;
        console.log(mes);
    
        if (val === 1) {
          // Send push notification only if val is 1
          const requestData = {
            admin_id: admin_id,
            volunteer_id: vol_id,
            Message: mes,
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
            console.log(responseBody);
            throw new Error('Failed to send push notification:');
          }
        }
    
        // Always delete the request
        const deleteResponse = await fetch(`http://127.0.0.1:8000/api/remove-requests/${reqid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const deleteResponseBody = await deleteResponse.json();
        if (!deleteResponse.ok) {
          console.log(deleteResponseBody);
          throw new Error('Failed to remove request:');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    useEffect(() => {
        setData(alldata);
    }, [alldata]);
    
    const handleAccept = async (reqid, id, vol_id, date, admin_id, name) => {
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
              "admin_id": admin_id,
              "req_id": reqid,
              "Message": `Your request for ${name} has been approved`
            };
            const response = await fetch('http://127.0.0.1:8000/api/events-signed-req-notif/', {
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
            console.log("worked")
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
        removeRequest(reqid, vol_id, admin_id, name, 0);
    };

    return (
        <div className={requests.container}>
            <h3 className={requests.h3}>Pending Approvals:</h3>
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
