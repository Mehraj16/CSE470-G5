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
  const itemsPerPage = 9;

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
            console.log(data)
            setTotalItems(responseBody.length); 
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
    handleClick = (item) => {
      navigate('../circular', {
        state: {
          id: item,
        }
      });
    };
  } else {
    handleClick = (item) => {
      console.log(item)
      window.open(item.article, '_blank');
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
                <Cards key={item.id} id={item.id} title={item.positionTitle} image={item.banner_image} date={item.deadline} 
                click={() => handleClick(item)} />
              ))}
          </div>
          :
          <div className='card-container'>
            {currentPageData.map((item) => (
                <Cards key={item.id} id={item.id} title={item.title} image={item.banner_image} date={item.date} 
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
