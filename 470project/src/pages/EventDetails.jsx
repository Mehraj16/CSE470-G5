import React , { useState, useEffect }from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../css/sidebar.css';
import '../css/header.css';
import '../css/details.css';
import Details from '../components/Details';
import { useLocation } from 'react-router-dom'


export default function EventDetails () {

  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const location = useLocation();
  const props = location.state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/signedUp.json'); // Assuming this is your endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if the id exists in the data fetched
        if (data.some(item => item.id === props.id)) {

          setStatus(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    setIsClicked(true);
  };
  return (
    <div className='App'>
      <Sidebar />
      <Header />
      <div className='Content'>
        {/* Pass props directly to the Details component */}
        <Details title={props.title} date={props.date} time={props.time} image={props.image} isClicked={isClicked} handleClick={handleClick} status={status}/>
      </div>
    </div>
  )
}
