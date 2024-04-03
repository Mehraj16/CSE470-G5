import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import requests from'../css/requests.module.css';
import Pagination from '../components/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SendInvites() {
  const location = useLocation();
  const props = location.state;
  const [data, setData] = useState({});
  const [profile, setProfile] = useState([]);
  const [showSelectedItems, setShowSelectedItems] = useState(false); 
  const [selectedItems, setSelectedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/eventsCreated.json');
        const jsonData = await response.json();
        const filteredData = jsonData.filter(event => event.eventId == props.eventId);
        setData(filteredData[0]);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [props.eventId]);
  
  useEffect(() => {
    fetchProfiles();
  }, [currentPage]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/someProfiles.json');
      const data = await response.json();
      if (Array.isArray(data)) { // Check if data is an array
        setProfile(data);
        setTotalItems(data.length);
      } else {
        console.error('Data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentPageData = profile.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleCheckboxChange = (e, item) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        setSelectedItems(prevSelectedItems => [...prevSelectedItems, item]);
      } else {
        setSelectedItems(prevSelectedItems =>
          prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id)
        );
      }
    };
  
    const handleAddButtonClick = () => {
      setShowSelectedItems(true);
    };
      

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h3>Send Invitations For:&nbsp;&nbsp;{data.title}</h3>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div className={requests.eventContainer}>
          <div className={requests.row}>
          <span className={requests.column} id={requests.head}>No.</span>
          <span className={requests.column} id={requests.head}>Select</span>
          <span className={requests.column} id={requests.head}>Name</span>
          </div>
          {currentPageData.map((item, index) => (
            <div key={item.id} className={requests.row}>
              <span className={requests.column}>{item.id}</span>
              <span className={requests.column}>
                <input
                  type="checkbox"
                  id={`checkbox-${item.id}-${index}`}
                  onChange={(e) => handleCheckboxChange(e, item)}
                />
              </span>
              <span className={requests.column}>{item.firstName} {item.lastName}</span>
            </div>
          ))}
      </div>
            <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={handlePageChange}
            />
            <button onClick={handleAddButtonClick}>Add</button>
            {showSelectedItems && (
                <>
                <h4>Selected Volunteers</h4>
                <div className={requests.eventContainer}>
                  <div className={requests.row}>
                    <span className={requests.column} id={requests.head}>No.</span>
                    <span className={requests.column} id={requests.head}>Name</span>
                  </div>
                    {selectedItems.map((item, index) => (
                      <div key={index} className={requests.row}>
                        <span className={requests.column}>{index + 1}</span>
                        <span className={requests.column}>{item.firstName} {item.lastName}</span>
                        <br />
                        <br />
                      </div>
                    ))}
                  </div>
                </>
            )}
        </div>
    </div>
  )
}
