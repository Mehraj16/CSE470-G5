import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import viewall from '../css/viewall.module.css';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';

export default function AdminJobs() {
    const location = useLocation();
    const props = location.state;
  
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 3;
    const [eventClicked, setEventClicked] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState([]); 

    useEffect(() => {
      fetchData();
    }, [currentPage]);
  
    // Function to fetch data for the current page
    const fetchData = async () => {
      // For the sake of this example, fetching mock JSON data
      const response = await fetch('/jobApply.json');
      const jsonData = await response.json();
      const filteredData = jsonData.filter(event => event.authorId === 5);
    
      setData(filteredData);
      setTotalItems(filteredData.length); 
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
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <table className={viewall.viewtable}>
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Position Title</th>
              <th>Applicant Name</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.applicationId}>
                <td>{item.applicationId}</td>
                <td><a className={viewall.clickToView} href="" onClick={(e) => showDetails(e, item)}>{item.positionTitle}</a></td>
                <td>{item.applicantName}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />

        {eventClicked && (
          <React.Fragment>
              <div className="application-details">
              <h3>Application Details</h3>
              <p><strong>Applicant Name:</strong> {selectedApplication.applicantName}</p>
              <p><strong>Position Title:</strong> {selectedApplication.positionTitle}</p>
              <p><strong>Deadline Date:</strong> {selectedApplication.deadlineDate}</p>
              <p>
                <strong>Resume: </strong> 
                  <a 
                    href={`/src/assets/${selectedApplication.resume}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {selectedApplication.resume}
                  </a>
            </p>

              <div className="buttons">
                <button >Approve</button>
                <button >Reject</button>
              </div>
            </div>
          </React.Fragment>
        )};
    </div>
    </div>
  )
}
