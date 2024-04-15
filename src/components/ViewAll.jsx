import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Cards from './Cards'
import Pagination from './Pagination';

const ViewAll = () => {
  const location = useLocation();
  const props = location.state;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
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
    fetchData();
  }, [currentPage, props]);

  const fetchData = async () => {
    let url = 'http://127.0.0.1:8000/api/posts/'; // Default URL
    if (props.type === 'jobs') { // Check prop value
      url = 'http://127.0.0.1:8000/api/jobs/';
    }
    try {
    const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
        });
    const responseBody = await response.json();
        if (!response.ok) {
            console.error('Failed request:', responseBody);
            throw new Error('Failed request');
          }
          setData(responseBody);
          setTotalItems(responseBody.length); 
          if(props.type === 'jobs'){
            const filteredData = responseBody.filter(job => new Date(job.deadline) >= new Date());
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
              setjobBannerImages(imageMap)
          }
          else{
            const imageDataPromises = responseBody.map(async (event) => {
              const imageUrl = await fetchImageData(event.id);
              return { eventId: event.id, imageUrl };
            });
            const images = await Promise.all(imageDataPromises);
            const imageMap = {};
            images.forEach((image) => {
              imageMap[image.eventId] = image.imageUrl;
            });
            setBannerImages(imageMap);
          }
        }catch (error) {
                console.error('Error:', error);
            }
  };


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  let handleClick;
  const navigate = useNavigate();
  if (props.type === 'jobs') {
    handleClick = (item, image) => {
      navigate('../circular', {
        state: {
          id: item,
          image: image
        }
      });
    };
  } else {
    handleClick = async (item) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/article-pdf/${item.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };
  }
  
  return (
    <div className='App'>
      <Sidebar />
      <Header />
      <div className='Content'>
        <div style={{
          width:'80%',
          borderBottom:'1px solid'
        }}>
          {props.type === 'jobs' ? <h2>Opportunities</h2> : <h2>Resources</h2>}
        </div>
        {props.type === 'jobs' ?
          <div className='card-container'>
            {currentPageData.map((item) => (
                <Cards key={item.id} id={item.id} title={item.positionTitle} banner_image={jobbannerImages[item.id]} date={item.deadline} 
                click={() => handleClick(item, jobbannerImages[item.id])} />
              ))}
          </div>
          :
          <div className='card-container'>
            {currentPageData.map((item) => (
                <Cards key={item.id} id={item.id} title={item.title} banner_image={bannerImages[item.id]} date={item.date} 
                click={() => handleClick(item)} />
              ))}
          </div>}
          <div style={{
            width:'90%',
            display:'inline-flex',
            justifyContent:'flex-end'
          }}>
          <h5>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h5>
          </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ViewAll;
