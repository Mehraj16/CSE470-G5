import React , { useState, useEffect }from 'react';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../css/details.css';
import Details from '../components/Details';
import { useLocation } from 'react-router-dom'


export default function EventDetails () {

  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const location = useLocation();
  const { id, title, image, date, time, profilepic } = location.state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/signedUp.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.some(item => item.id === id)) {

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
      <Header profilepic={`/src/assets/${profilepic}`}/>
      <div className='Content'>
        {console.log(title)}
        <Details title={title} date={date} time={time} image={`/src/assets/${image}`} isClicked={isClicked} handleClick={handleClick} status={status}/>
      </div>
    </div>
  )
}
