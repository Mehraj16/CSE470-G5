import React, { useState, useEffect } from 'react'
import '../App.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cards from '../components/Cards';
import '../css/sidebar.css'
import '../css/header.css'
import '../css/cards.css'

function Events() {
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json');// test file used in public folder
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');// test file used in public folder
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
  
    return (
      <div className='App'>
        <Sidebar />
        <Header profilepic={`/src/assets/${profileData.profileImage}`}/>
        <div className='Content'>
            <div className='card-container'>{/*for every item in the json file one card is created*/}
            {data.map(item => (
              <Cards key={item.id} title={item.title} image={`/src/assets/${item.image}`} date={item.date} time={item.time}/>
          ))}
            </div>
          </div>
      </div>
    );
  }
  
  export default Events;
  