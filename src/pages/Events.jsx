import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cards from '../components/Cards';
import Filter from '../components/Filter';
import { useLocation, useNavigate } from 'react-router-dom';

function Events() {
  const location = useLocation();
  const props = location.state;
  
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [filterOption, setFilterOption] = useState(props ? props : 'all');
  const [signedData, setSignedData] = useState([]);
  const [suggestedData, setSuggestedData] = useState([]);
  const [commonIds, setCommonIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, dataResponse, signedResponse, suggestedResponse] = await Promise.all([
          fetch('/profile.json'),
          fetch('/data.json'),
          fetch('/signedUp.json'),
          fetch('/suggested.json')
        ]);

        const profileData = await profileResponse.json();
        const data = await dataResponse.json();
        const signed = await signedResponse.json();
        const suggested = await suggestedResponse.json();

        setProfileData(profileData);
        setData(data);
        setSignedData(signed);
        setSuggestedData(suggested);

        const commonIds = signed.map(signedItem => signedItem.id).filter(id => data.some(item => item.id === id));
        setCommonIds(commonIds);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterOptionSelect = (option) => {
    setFilterOption(option);
  };

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
    case 'suggested':
      filteredData = suggestedData;
      break;
    default:
      filteredData = data;
      break;
  }

  const navigation = useNavigate();
  const handleClick = (item) => {
    const { id, title, image, date, time } = item;
    const profilepic = profileData.profileImage;
    navigation('../eventdetails', { state: { id, title, image, date, time, profilepic } });
  };

  return (
    <div className='App'>
      <Sidebar profilepic={`/src/assets/${profileData.profileImage}`}/>
      <Header profilepic={`/src/assets/${profileData.profileImage}`} />
      <div className='Content'>
        <div className='filter'>
          <Filter onOptionSelect={handleFilterOptionSelect} option={filterOption}/>
        </div>
        <div className='card-container'>
          {filteredData.map(item => (
            <Cards
              key={item.id}
              id={item.id}
              title={item.title}
              image={`/src/assets/${item.image}`}
              date={item.date}
              time={item.time}
              profilepic={profileData.profileImage}
              click={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
