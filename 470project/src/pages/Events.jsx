import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cards from '../components/Cards';
import Filter from '../components/Filter';

function Events() {
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [filterOption, setFilterOption] = useState('all');
  const [signedData, setSignedData] = useState([]);
  const [commonIds, setCommonIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch('/profile.json');
        if (!profileResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataResponse = await fetch('/data.json');
        if (!dataResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await dataResponse.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/signedUp.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const signedData = await response.json();
        setSignedData(signedData);

        // Find common IDs between signed-up data and original data
        const commonIds = signedData.map(signedItem => signedItem.id)
                                     .filter(id => data.some(item => item.id === id));
        setCommonIds(commonIds);
      } catch (error) {
        console.error('Error fetching signed-up data:', error);
      }
    };

    fetchData();
  }, [data]); // Trigger the effect whenever data changes

  const handleFilterOptionSelect = (option) => {
    setFilterOption(option);
  };

  // Filter and sort data based on selected option
  let filteredData = [];
  switch (filterOption) {
    case 'signedUpEvents':
      filteredData = data.filter(item => commonIds.includes(item.id));
      break;
    case 'eventsNotSignedUp':
      filteredData = data.filter(item => !commonIds.includes(item.id));
      break;
    case 'sortDate':
      filteredData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      filteredData = data;
      break;
  }

  return (
    <div className='App'>
      <Sidebar profilepic={`/src/assets/${profileData.profileImage}`}/>
      <Header profilepic={`/src/assets/${profileData.profileImage}`} />
      <div className='Content'>
        <div className='filter'>
          <Filter onOptionSelect={handleFilterOptionSelect} />
        </div>
        <div className='card-container'>
          {/* Render cards based on filtered data */}
          {filteredData.map(item => (
            <Cards key={item.id} id={item.id} title={item.title} image={`/src/assets/${item.image}`} date={item.date} time={item.time} profilepic={profileData.profileImage}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
