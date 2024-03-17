import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Jobs from '../components/Jobs'
import { IoArrowForwardCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function Discover() {
  const [profileData, setProfileData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        setProfileData(Data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/jobs.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        setData(Data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const [resource, setResource] = useState([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('/article.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        setResource(Data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const navigation = useNavigate();
  const showResources = () => {
      navigation('../viewall', {state: profileData.profileImage});
  };

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${profileData.profileImage}`}/>
      <div className='Content' style={{
        marginRight: '25px',
      }}>
       <div className='opp-wrapper'>
            <h3 className='opp'>Resources</h3>
            <IoArrowForwardCircle className='show-items' onClick={showResources}/>
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {resource.map(item => (
                        <Jobs key={item.id} id={item.id} title={item.title} image={item.image} date={item.date} type={'Published'} profilepic={`/src/assets/${profileData.profileImage}`} code={1}/>
                ))}
            </div>
        </div>
        <div className='opp-wrapper'>
            <div><h3 className='opp'>Opportunities</h3></div>
            <IoArrowForwardCircle className='show-items' />
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {data.map(item => (
                        <Jobs key={item.id} id={item.id} title={item.title} image={`/src/assets/${item.image}`} date={item.date} type={'Deadline'} profilepic={`/src/assets/${profileData.profileImage}`} code={2}/>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
