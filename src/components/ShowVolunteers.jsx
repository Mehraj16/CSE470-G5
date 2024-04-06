import React, { useState, useEffect } from 'react';
import requests from'../css/requests.module.css';
import Pagination from './Pagination';

export default function ShowVolunteers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

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
  return (
        <div>
              <h2>All Volunteers</h2>
              <div className={requests.eventContainer}>
                <div className={requests.volunteerContainer}>
                    <table className={requests.table}>
                    <thead>
                        <tr className={requests.trow}>
                        <th className={requests.cell} id={requests.head}>ID</th>
                        <th className={requests.cell} id={requests.head}>Name</th>
                        <th className={requests.cell} id={requests.head}>Date of Birth</th>
                        <th className={requests.cell} id={requests.head}>Address</th>
                        <th className={requests.cell} id={requests.head}>Email</th>
                        <th className={requests.cell} id={requests.head}>Blood Group</th>
                        <th className={requests.cell} id={requests.head}>Gender</th>
                        <th className={requests.cell} id={requests.head}>Score</th>
                        <th className={requests.cell} id={requests.head}>Total Medals</th>
                        <th className={requests.cell} id={requests.head}>Event Count</th>
                        <th className={requests.cell} id={requests.head}>Interests</th>
                        <th className={requests.cell} id={requests.head}>Skills</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((item) => (
                        <tr key={item.id} className={requests.trow}>
                            <td className={requests.cell}>{item.id}</td>
                            <td className={requests.cell}>{item.firstName} {item.lastName}</td>
                            <td className={requests.cell}>{item.dob}</td>
                            <td className={requests.cell}>{item.city}</td>
                            <td className={requests.cell}>{item.email}</td>
                            <td className={requests.cell}>{item.blood}</td>
                            <td className={requests.cell}>{item.gender}</td>
                            <td className={requests.cell}>{item.lifetimeScore}</td>
                            <td className={requests.cell}>{item.totalMedals}</td>
                            <td className={requests.cell}>{item.eventCount}</td>
                            <td className={requests.cell}>{item.interests}</td>
                            <td className={requests.cell}>{item.skills}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <h5>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h5>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
  )
}
