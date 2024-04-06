import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from "../css/manage.module.css";
import requests from'../css/requests.module.css';
import Pagination from '../components/Pagination';
import ShowVolunteers from '../components/ShowVolunteers';

export default function Accounts() {
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showVol, setShowVol] = useState(false);

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    let url;
    url = 'http://127.0.0.1:8000/api/admins';
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
          console.log("succes");
          setData(responseBody);
          setTotalItems(responseBody.length); 
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

  const createNewAdmin = async(e) =>{
    let url;
    url = 'http://127.0.0.1:8000/api/admin/register/'; // Log error if attempting to login with number
       const requestBody = {
           "id": adminId, // Assuming ID is numeric
           "password": password,
           "Designation": designation
       };
            
        try {
            const response = await fetch(url, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                body: JSON.stringify(requestBody)
             });
        
                const responseBody = await response.json(); // Read response body
                if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
                console.log("succes");
            } catch (error) {
                console.error('Error:', error);
            }
  }
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
      <AdminHeader/>
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
              <label>ID:</label><br />
              <input type="number" id="adminId" name="adminId" onChange={(e) => setAdminId(e.target.value)}/>
            </div>
            <div>
              <label>Designation:</label><br />
              <input type="text" id="designation" onChange={(e) => setDesignation(e.target.value)}name="Designation"/>
            </div>
            <div>
              <label>Password:</label><br />
              <input type="password" id="password" onChange={(e) => setPassword(e.target.value)}
              name="password"/>
            </div>
            <button onClick={createNewAdmin}>Create Account</button>
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
                  <span className={requests.column}>{item.firstName} {item.lastName}</span>
                  <span className={requests.column}>{item.Designation}</span>
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
