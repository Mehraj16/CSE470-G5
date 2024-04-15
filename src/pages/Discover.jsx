import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Jobs from '../components/Jobs'
import { IoArrowForwardCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import MvvMode from '../components/MvvMode';

export default function Discover() {
  const [data, setData] = useState([]);
  const [bannerImages, setBannerImages] = useState({});
  const [jobbannerImages, setjobBannerImages] = useState({});

  const fetchJobImageData = async (itemId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/job-banner/${itemId}`, {
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
      return null;
    }
  };

  const fetchImageData = async (itemId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/article-banner/${itemId}`, {
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
    const fetchJobData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        // Filter out jobs with deadlines less than today's date
        const filteredData = Data.filter(job => new Date(job.deadline) >= new Date());
        setData(filteredData);
        
        const imageDataPromises = filteredData.map(async (event) => {
          const imageUrl = await fetchJobImageData(event.id);
          return { eventId: event.id, imageUrl };
        });
        const images = await Promise.all(imageDataPromises);
        const imageMap = {};
        images.forEach((image) => {
          imageMap[image.eventId] = image.imageUrl;
        });
        setjobBannerImages(imageMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchJobData();
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
        const imageDataPromises = Data.map(async (event) => {
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
            <h3 className='opp'>Resources</h3>
            <IoArrowForwardCircle className='show-items' onClick={showResources}/>
       </div>
        <div className='scroll-container'>
            <div className='job-cards'>
                {resource.map(item => (
                        <Jobs key={item.id} id={item.id} positionTitle={item.title} banner_image={bannerImages[item.id]} deadline={item.date} type={'Published'} code={1}/>
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
                        <Jobs key={item.id} id={item.id} positionTitle={item.positionTitle} banner_image={jobbannerImages[item.id]} deadline={item.deadline} description={item.description} type={'Deadline'} admin_id={item.admin_id} code={2}/>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}
