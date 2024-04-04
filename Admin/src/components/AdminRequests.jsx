import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import requests from'../css/requests.module.css';

export default function AdminRequests({ onViewDetails}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/someProfiles.json'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAccept = (id) => {
        // onAccept(id);
        setData(prevData => prevData.map(item => {
            if (item.id === id) {
                return { ...item, status: 'accepted' };
            }
            return item;
        }));
    };

    const handleReject = (id) => {
        // onReject(id);
        setData(prevData => prevData.map(item => {
            if (item.id === id) {
                return { ...item, status: 'rejected' };
            }
            return item;
        }));
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
                        <span className={requests.column}>{event.firstName}</span>
                        <span className={requests.column}>{event.title}Inauguration</span>
                        <span className={requests.columnbtn}>
                            <button onClick={() => onViewDetails(event.id)}>View</button>
                            {event.status === 'accepted' ? (
                                <FaCheck className={requests.icon} />
                            ) : event.status === 'rejected' ? (
                                <RiCloseLine className={requests.icon} />
                            ) : (
                                <>
                                    <button onClick={() => handleAccept(event.id)}>Accept</button>
                                    <button onClick={() => handleReject(event.id)}>Reject</button>
                                </>
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
