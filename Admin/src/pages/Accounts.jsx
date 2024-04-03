import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from "../css/manage.module.css";
import requests from'../css/requests.module.css';
import Pagination from '../components/Pagination';
import ShowVolunteers from '../components/ShowVolunteers';

export default function Accounts() {
  const [profileData, setProfileData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showVol, setShowVol] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        setProfileData(Data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/admins.json');
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

  const toggleFormVisibility = () => {
    setShowList(false);
    setShowVol(false);
    setShowForm(!showForm);
  };
  const toggleListVisibility = () => {
    setShowForm(false);
    setShowVol(false);
    setShowList(!showList);
  };
  const toggleVolVisibility = () => {
    setShowList(false);
    setShowForm(false);
    setShowVol(!showVol);
  };

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${profileData.profileImage}`}/>
      <div className='Content'>
        <div>
          <h3 className={manage.headline}>Accounts</h3>
        </div>
        <div className={manage.jobsCreate}>
          <div>
            <button onClick={toggleFormVisibility}>Create New Admin</button>
          </div>
          <div>
            <button onClick={toggleListVisibility}>View All Admin</button>
          </div>
          <div>
            <button onClick={toggleVolVisibility}>View All Volunteers</button>
          </div>
        </div>
        {showForm && (
          <form className={manage.formCreate}>
            <div>
              <label>Email:</label><br />
              <input type="email" />
            </div>
            <div>
              <label>Password:</label><br />
              <input type="password" />
            </div>
            <button type="submit">Create Account</button>
          </form>
        )}
        {showList && (
          <div>
              <h2>All Admins</h2>
              <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
              <div className={requests.eventContainer}>
              <div className={requests.row}>
                <span className={requests.column} id={requests.head}>Admin ID</span>
                <span className={requests.column} id={requests.head}>Admin Name</span>
                <span className={requests.column} id={requests.head}>Designation</span>
              </div>
              {currentPageData.map((item) => (
                <div key={item.applicationId} className={requests.row}>
                  <span className={requests.column}>{item.id}</span>
                  <span className={requests.column}>{item.firstname} {item.lastname}</span>
                  <span className={requests.column}>{item.designation}</span>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
          
        )}
        {showVol && (
          <ShowVolunteers />
        )}
      </div>
    </div>
  );
}
