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
    const jsonString = sessionStorage.getItem('profileData');
    const mydata = JSON.parse(jsonString);
    const admin_id = mydata.id;
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 4;
    const [eventClicked, setEventClicked] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState([]); 
    const [jobs, setJobs] = useState({});
    const [resume, setResume] = useState();


    useEffect(() => {
      const fetchData = async () => {
          try {
              const appResponse = await fetch('http://127.0.0.1:8000/api/apps/', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              if (!appResponse.ok) {
                  throw new Error('Network response was not ok');
              }
              const appData = await appResponse.json();
  
              // Filter applications where admin_id matches id
              const filteredApps = appData.filter(app => app.admin_id === admin_id);
  
              // Fetch jobs
              const jobResponse = await fetch('http://127.0.0.1:8000/api/jobs/', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              const jobResponseBody = await jobResponse.json();
              if (!jobResponse.ok) {
                  console.error('Failed request:', jobResponseBody);
                  throw new Error('Failed request');
              }
  
              const jobsDict = {};
              filteredApps.forEach(app => {
                  const filteredJobs = jobResponseBody.filter(job => job.id === app.job_id);
                  jobsDict[app.job_id] = filteredJobs;
              });
              setTotalItems(filteredApps.length)
              setData(filteredApps);
              setJobs(jobsDict);

          } catch (error) {
              console.error('Error fetching data:', error);
          }
      }; 
      fetchData();
  }, [currentPage]);
  
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentPageData = data.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
    console.log(jobs)
    const showDetails = (e, eventData) => {
      e.preventDefault();
      setEventClicked(true);
      setSelectedApplication(eventData);
      showResume(e, eventData);
    };
    const showResume = async (e, item) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/resume/${item.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResume(url);
        console.log(url)
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };
    const handleProcess = async (item) =>{
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/delete-resume/${item.id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h2>Submissions To Your Postings</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div className={requests.eventContainer}>
        <div className={requests.row}>
          <span className={requests.column} id={requests.head}>Application ID</span>
          <span className={requests.column} id={requests.head}>Position Title</span>
          <span className={requests.column} id={requests.head}>Applicant Name</span>
        </div>
        {currentPageData.map((item) => (
          <div key={item.applicationId} className={requests.row}>
            <span className={requests.column}>{item.id}</span>
            <span className={requests.column}>
              <a
                className={viewall.clickToView}
                href=""
                onClick={(e) => showDetails(e, item)}
              >
                {jobs[item.job_id][0].positionTitle}
              </a>
            </span>
            <span className={requests.column}>{item.name}</span>
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
                <span className={manage.cell}>{selectedApplication.name}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Position Title:</strong></span>
                <span className={manage.cell}>{jobs[selectedApplication.job_id][0].positionTitle}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Deadline Date:</strong></span>
                <span className={manage.cell}>{selectedApplication.date}</span>
              </span>
              <span className={manage.row}>
                <span className={manage.cell}><strong>Resume:</strong></span>
                <span className={manage.cell}>
                  <a 
                    href={resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    resume_{selectedApplication.id}
                  </a>
                </span>
              </span>
            </div>
            <div className={manage.button}>
              <button onClick={() => handleProcess(selectedApplication)}>Processed</button>
            </div>
          </div>
          </React.Fragment>
        )};
    </div>
    </div>
  )
}
