import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useLocation } from 'react-router-dom'

export default function Circular() {
  const location = useLocation();
  const props = location.state;

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/jobs.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        const foundItem = Data.find(item => item.id === props.id);
        if (foundItem) {
        setData(foundItem);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${props}`}/>
      <div className='Content' style={{
          width: '73%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <div className='banner'>
            <img src={`/src/assets/${data.image}`} alt="eventBanner" style={{
                width: '75%',
                height: 'auto',
            }}/>
            <p>Position Title</p>
            <p>{data.title}</p>
            <p>Application deadline</p>
            <p>{formatDate(data.date)}</p>
            <p>Job Details</p>
            <p>{data.description}</p>
      </div>
      </div>
    </div>
  )
}
