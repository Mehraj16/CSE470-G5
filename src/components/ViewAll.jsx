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
    let url = '/article.json'; // Default URL
    if (props.someProp === 'jobs') { // Check prop value
      url = '/jobs.json'; // Change URL if prop value matches
    }
    const response = await fetch(url);
    const jsonData = await response.json();
    setData(jsonData);
    setTotalItems(jsonData.length); 
  };


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  let handleClick;
  const navigate = useNavigate();
  if (props.someProp === 'jobs') {
    handleClick = (item) => {
      navigate('../circular', {
        state: {
          props: props.profilepic,
          id: item,
        }
      });
    };
  } else {
    handleClick = (item) => {
      window.open(item.content, '_blank');
    };
  }
  
  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${props.props}`}/>
      <div className='Content'>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
          <div className='card-container'>
            {currentPageData.map((item) => (
                <Cards key={item.id} id={item.id} title={item.title} image={item.image} date={item.date} 
                click={() => handleClick(item)} />
              ))}
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
