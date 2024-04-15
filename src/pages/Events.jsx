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
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;

  const [data, setData] = useState([]);
  const [filterOption, setFilterOption] = useState(props ? props : 'all');
  const [signedData, setSignedData] = useState([]);
  const [commonIds, setCommonIds] = useState([]);
  const [bannerImages, setBannerImages] = useState({});

  const fetchImageData = async (itemId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/event-banner/${itemId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    } catch (error) {
      console.error('Error:', error);
      return null; // Return null on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, signedResponse] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/events-with-dates/'),
          fetch('http://127.0.0.1:8000/api/events-signed-up/')
        ]);
        const data = await dataResponse.json();
        const signed = await signedResponse.json();

        setData(data);
        setSignedData(signed);

        const commonIds = signed
          .filter(signedItem => signedItem.volunteer_id === myid)
          .map(filteredItem => filteredItem.event_id);
        setCommonIds(commonIds);

        // Fetch banner images for all events
        const imageDataPromises = data.map(async (event) => {
          const imageUrl = await fetchImageData(event.id);
          return { eventId: event.id, imageUrl };
        });
        const images = await Promise.all(imageDataPromises);
        const imageMap = {};
        images.forEach((image) => {
          imageMap[image.eventId] = image.imageUrl;
        });
        setBannerImages(imageMap);
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
    default:
      filteredData = data;
      break;
  }

  const navigation = useNavigate();
  const handleClick = (item) => {
    navigation('../eventdetails', { state: { ...item, banner_image: bannerImages[item.id] } });
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
          {filteredData.map(item => (
            <Cards
              key={item.id}
              id={item.id}
              adminid={item.admin_id}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              banner_image={bannerImages[item.id]}
              description={item.description}
              click={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
