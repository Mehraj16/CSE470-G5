import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import requests from'../css/requests.module.css';

export default function AdminRequests({ onViewDetails}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/invites.json'); 
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
        <div className={requests.tableContainer}>
            <h3>Pending Approvals</h3>
            <table className={requests.reqtable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Event</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(event => (
                        <tr key={event.id}>
                            <td>{event.author}</td>
                            <td>{event.title}</td>
                            <td className={requests.ctabtn}>
                                <button onClick={() => onViewDetails(event.id)}>View</button>
                                {event.status === 'accepted' ? (
                                    <FaCheck className='check'/>
                                ) : event.status === 'rejected' ? (
                                    <RiCloseLine className='cross' style={{
                                        strokeWidth: '1',
                                        height: '35px',
                                        width: '25px',
                                    }}/>
                                ) : (
                                    <>
                                        <button onClick={() => handleAccept(event.id)}>Accept</button>
                                        <button onClick={() => handleReject(event.id)}>Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
