import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DetailedView from '../components/DetailedView';
import { useLocation } from 'react-router-dom'

export default function Invites() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const location = useLocation();
  const props = location.state;
  console.log(props)

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
      <Header profilepic={`/src/assets/${props.profilepic}`}/>
      <div className='leading-title'>
        <p>Your Event Roster</p>
      </div>
      <div className='profile-content' style={{
        marginTop: '10px',
      }}>
        <div className='table-container' style={{
                width: '45vw',
        }}>
                <table style={{
                  width: '45vw',
                  marginRight: '20px',
                  borderCollapse: 'collapse'
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                  width: '34%',
                                }}>Date</th>
                            <th style={{
                                  width: '36%',
                                }}>Event Name</th>
                            <th style={{
                                  width: '50%',
                                }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(event => (
                            <tr key={event.id}>
                                <td>{event.date}</td>
                                <td>{event.title}</td>
                                <td className='cta-btn' style={{
                                  width: 'auto',
                                }}>
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
