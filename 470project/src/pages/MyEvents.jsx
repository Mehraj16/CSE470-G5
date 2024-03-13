import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../App.css';
import '../css/sidebar.css';
import '../css/header.css';
import '../css/requests.css';
import DetailedView from '../components/DetailedView';


export default function Invites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

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

  const handleViewDetails = (eventId) => {
    // Find the data with the matching eventId
    const selectedEventData = data.find(item => item.id === eventId);
    setSelectedData(selectedEventData);
  };

  return (
    <div className='App'>
      <Sidebar />
      <Header />
      <div className='leading-title'>
        <p>Your Event Roster</p>
      </div>
      <div className='profile-content' style={{
        marginTop: '10px',
      }}>
        <div className='table-container' style={{
                width: '50vw',
        }}>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(event => (
                            <tr key={event.id}>
                                <td>{event.date}</td>
                                <td>{event.title}</td>
                                <td className='cta-btn'>
                                    <button onClick={() => handleViewDetails(event.id)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <DetailedView 
                author={selectedData?.author}
                image={selectedData?.image}
                date={selectedData?.date}
                time={selectedData?.time}
                rewards={selectedData?.rewards}
                location={selectedData?.location}
            />
      </div>
    </div>
  );
}
