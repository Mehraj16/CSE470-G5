import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Cards from '../components/Cards';
import Filter from '../components/Filter';
import { useLocation, useNavigate } from 'react-router-dom';
import MvvMode from '../components/MvvMode';

function Events() {
  const location = useLocation();
  const props = location.state;
  
  const [data, setData] = useState([]);
  const [filterOption, setFilterOption] = useState(props ? props : 'all');
  const [signedData, setSignedData] = useState([]);
  const [suggestedData, setSuggestedData] = useState([]);
  const [commonIds, setCommonIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, signedResponse, suggestedResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/events/'),
          fetch('http://127.0.0.1:8000/api/events-signed-up/'),
          fetch('/suggested.json')
        ]);
        const data = await dataResponse.json();
        const signed = await signedResponse.json();
        const suggested = await suggestedResponse.json();

        setData(data);
        setSignedData(signed);
        setSuggestedData(suggested);

        const dataArray = Array.isArray(data) ? data : [data];
        const commonIds = signed
          .map(signedItem => signedItem.event_id)
          .filter(id => dataArray.some(item => item.id === id));
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
    navigation('../eventdetails', { state: item });
  };

  return (
    <div className='App'>
      <MvvMode />
      <Sidebar />
      <Header />
      <div className='Content'>
        <div className='filter'>
          <Filter onOptionSelect={handleFilterOptionSelect} option={filterOption}/>
        </div>
        <div className='card-container'>
        {Array.isArray(filteredData) ? (
          filteredData.map(item => (
            <Cards
              key={item.id}
              id={item.id}
              adminid={item.admin_id}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              banner_image={item.image}
              description={item.description}
              click={() => handleClick(item)}
            />
          ))
        ) : (
          Object.values(filteredData).map(item => (
            <Cards
              key={item.id}
              id={item.id}
              adminid={item.admin_id}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              banner_image={item.image}
              description={item.description}
              click={() => handleClick(item)}
            />
          ))
        )}

        </div>
      </div>
    </div>
  );
}

export default Events;
