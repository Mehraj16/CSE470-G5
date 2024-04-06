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
  const jsonString = localStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const admin_id = mydata.id;
  const name = mydata.firstName;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/eventsCreated.json');
  //       const jsonData = await response.json();
  //       const filteredData = jsonData.filter(event => event.eventId == props.eventId);
  //       setData(filteredData[0]);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [props.eventId]);
  
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    let url;
    url = 'http://127.0.0.1:8000/api/users';
    try {
      const response = await fetch(url, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
           },
       });
          const responseBody = await response.json(); // Read response body
          if (!response.ok) {
              console.error('Failed request:', responseBody); // Log error and response body
              throw new Error('Failed request');
          }
          setProfile(responseBody);
          setTotalItems(responseBody.length); 
      } catch (error) {
          console.error('Error:', error);
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
      console.log(selectedItems)
    };
  
    const handleAddButtonClick = () => {
      setShowSelectedItems(true);
    };
    const handleSubmit = async () => {
      try {
        for (const selectedItem of selectedItems) {
          // Prepare the data to be sent in the request body
          const requestData = {
            "admin_id": admin_id,
            "event_id": props.id,
            "volunteer_id": selectedItem.id
          };
          
          // Send a POST request to the API endpoint with the selected volunteer data
          const response = await fetch('http://127.0.0.1:8000/api/invitations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
          
          const responseBody = await response.json();
          if (!response.ok) {
            console.log(responseBody)
            throw new Error('Failed to send invitation for volunteer:', selectedItem);
          }
          setSelectedItems([]);
          setShowSelectedItems(false);
          try{
            const mes = `${name} has invited you to sign up.`
            console.log(mes)
            const requestData = {
              "admin_id": admin_id,
              "volunteer_id": selectedItem.id,
              "Message": mes
            };
            const response = await fetch('http://127.0.0.1:8000/api/notifications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            });
            
            const responseBody = await response.json();
            if (!response.ok) {
              console.log(responseBody)
              throw new Error('Failed to send invitation for volunteer:', selectedItem);
            }
          }catch (error) {
            console.error('Error sending notifss:', error);   
          }
        }
        
      } catch (error) {
        console.error('Error sending invitations:', error);
      }
    };
     

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader />
      <div className='Content'>
        <h3>Send Invitations For:&nbsp;&nbsp;{props.title}</h3>
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
                  <button onClick={handleSubmit}>Send</button>
                </>
            )}
        </div>
    </div>
  )
}
