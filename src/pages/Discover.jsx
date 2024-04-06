import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Jobs from '../components/Jobs'
import { IoArrowForwardCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import MvvMode from '../components/MvvMode';

export default function Discover() {
  const [suggestedData, setSuggestedData] = useState([]);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/'); 
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
        const response = await fetch('http://127.0.0.1:8000/api/posts/'); 
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/suggested.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const suggested = await response.json();
        setSuggestedData(suggested);
      } catch (error) {
        console.error('Error fetching signed-up data:', error);
      }
    };

    fetchData();
  }, []);
  const navigation = useNavigate();
  const showResources = () => {
    navigation('../viewall', {
      state: {
        type:'articles',
      }
    });
  };

  const showJobs = () => {
    navigation('../viewall', {
      state: {
        type: 'jobs',
      }
    });
  };
  const showSuggestedEvents = () => {
    navigation('../events', { state: 'suggested'});
  }
  return (
    <div className='App'>
      <MvvMode />
      <Sidebar />
      <Header />
      <div className='Content' style={{
        marginRight: '25px',
      }}>
       <Leaderboard />
       <div className='opp-wrapper'>
            <div><h3 className='opp'>Suggested For You</h3></div>
            <IoArrowForwardCircle className='show-items' onClick={showSuggestedEvents}/>
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {suggestedData.map(item => (
                        <Jobs key={item.id} id={item.id} title={item.title} image={`/src/assets/${item.image}`} date={item.date} type={'Date'}code={0}/>
                ))}
            </div>
        </div>
       <div className='opp-wrapper'>
            <h3 className='opp'>Resources</h3>
            <IoArrowForwardCircle className='show-items' onClick={showResources}/>
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {resource.map(item => (
                        <Jobs key={item.id} id={item.id} title={item.title} image={item.banner_image} date={item.date} type={'Published'} article={item.article} code={1}/>
                ))}
            </div>
        </div>
        <div className='opp-wrapper'>
            <div><h3 className='opp'>Opportunities</h3></div>
            <IoArrowForwardCircle className='show-items' onClick={showJobs}/>
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {data.map(item => (
                        <Jobs key={item.id} id={item.id} title={item.positionTitle} image={item.banner_image} date={item.deadline} type={'Deadline'} code={2}/>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
