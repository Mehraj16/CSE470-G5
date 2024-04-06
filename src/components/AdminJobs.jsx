import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import viewall from '../css/viewall.module.css';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';
import requests from'../css/requests.module.css';

export default function AdminJobs() {
    const location = useLocation();
    const props = location.state;
    const jsonString = localStorage.getItem('profileData');
    const mydata = JSON.parse(jsonString);
    const admin_id = mydata.id;
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 7;
    const [eventClicked, setEventClicked] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState([]); 

    useEffect(() => {
      fetchData();
    }, [currentPage]);
  
    // Function to fetch data for the current page
    const fetchData = async () => {
      // For the sake of this example, fetching mock JSON data
      let url = 'http://127.0.0.1:8000/api/jobs/';
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
              const filteredData = responseBody.filter(event => event.admin_id === admin_id);
              setData(filteredData);
              setTotalItems(filteredData.length);

            } catch (error) {
                console.error('Error:', error);
            }  
    };
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentPageData = data.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const showDetails = (e, eventData) => {
      e.preventDefault();
      setEventClicked(true);
      setSelectedApplication(eventData);
    };

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h2>Submissions To Your Postings</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div className={requests.eventContainer}>
        <div className={requests.row}>
          <span className={requests.column} id={requests.head}>Job ID</span>
          <span className={requests.column} id={requests.head}>Position Title</span>
          <span className={requests.column} id={requests.head}>Applicant Name</span>
        </div>
        {currentPageData.map((item) => (
          <div key={item.applicationId} className={requests.row}>
            <span className={requests.column}>{item.applicationId}</span>
            <span className={requests.column}>
              <a
                className={viewall.clickToView}
                href=""
                onClick={(e) => showDetails(e, item)}
              >
                {item.positionTitle}
              </a>
            </span>
            <span className={requests.column}>{item.applicantName}</span>
          </div>
        ))}
      </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />

        {eventClicked && (
          <React.Fragment>
            <div className={manage.applicationDetails}>
            <h3>Application Details</h3>
            <div className={manage.table}>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Applicant Name:</strong></span>
                <span className={manage.cell}>{selectedApplication.applicantName}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Position Title:</strong></span>
                <span className={manage.cell}>{selectedApplication.positionTitle}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Deadline Date:</strong></span>
                <span className={manage.cell}>{selectedApplication.deadlineDate}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Resume:</strong></span>
                <span className={manage.cell}>
                  <a 
                    href={`/src/assets/${selectedApplication.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {selectedApplication.resume}
                  </a>
                </span>
              </span>
            </div>
            <div className={manage.button}>
              <button>Processed</button>
            </div>
          </div>
          </React.Fragment>
        )};
    </div>
    </div>
  )
}
