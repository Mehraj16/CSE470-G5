import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

export default function Requests({ onViewDetails}) {
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
        <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Event Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(event => (
                        <tr key={event.id}>
                            <td>{event.author}</td>
                            <td>{event.title}</td>
                            <td className='cta-btn'>
                                <button onClick={() => onViewDetails(event.id)}>View Details</button>
                                {event.status === 'accepted' ? (
                                    <FaCheck className='check'/>
                                ) : event.status === 'rejected' ? (
                                    <RiCloseLine className='cross'/>
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
