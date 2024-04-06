import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import viewall from "../css/viewall.module.css";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import requests from'../css/requests.module.css';
import { MdOutlineFileUpload } from "react-icons/md";

export default function AdminPosts() {
  const location = useLocation();
  const props = location.state;
  const jsonString = localStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const admin_id = mydata.id;

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3; // Change this according to your requirements
  const [eventClicked, setEventClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Function to fetch data for the current page
  const fetchData = async () => {
    let url = 'http://127.0.0.1:8000/api/posts/';
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
    handleEventClick(eventData);
  };
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    article: null,
    banner_image: null,
    admin_id: admin_id 
  });

  const handleEventClick = (eventData) => {
    setFormData({
      ...formData,
      id: eventData.id,
      title: eventData.title,
      date: eventData.date,
      article: eventData.article,
      banner_image: eventData.banner_image,
      admin_id: admin_id 
    });
    setEventClicked(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData({
      ...formData,
      [name]: value,
      date: currentDate
    });
  };

  const handleSubmit = async (event) => {
    const postId = event.id;
    let url = `http://127.0.0.1:8000/api/posts/${postId}`;
        try {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
          console.log(formData);
          const responseBody = await response.json(); // Read response body
            if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
              console.log("posted");
            } catch (error) {
                console.error('Error:', error);
            }
  };

  return (
    <div className="App">
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className="Content">
        <h2>All Your Articles</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div className={requests.eventContainer}>
          <div className={requests.row}>
            <span className={requests.column} id={requests.head}>Post ID</span>
            <span className={requests.column} id={requests.head}>Article Title</span>
            <span className={requests.column} id={requests.head}>Date</span>
          </div>
          {currentPageData.map((item) => (
            <div key={item.postId} className={requests.row}>
              <span className={requests.column}>{item.id}</span>
              <span className={requests.column}>
                <a
                  className={viewall.clickToView}
                  href=""
                  onClick={(e) => showDetails(e, item)}
                >
                  {item.title}
                </a>
              </span>
              <span className={requests.column}>{item.date}</span>
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
            <h3 className={manage.headline}>Edit Article</h3>
            <div className={manage.eventForm}>
            <div className={manage.inputContainer}>
              <label htmlFor="title">Title:</label><br />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              </div>
              <div className={manage.formDiv}>
                <div className={manage.inputContainer}>
                    <label htmlFor="date">Date:</label><br />
                    <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={manage.dateInput}
                    />
                </div>
                  <div className={manage.fileBox}>
                  <label htmlFor="banner">Article (*PDF only):</label><br />
                  <label htmlFor="resume" className={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="pdf"
                      name="pdf"
                      onChange={handleChange}
                      className={manage.fileInput}
                      />
                  </div>
            </div>
            <div className={manage.fileBox}>
                  <label htmlFor="banner">Banner:</label><br />
                  <label htmlFor="resume" className={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="image"
                      name="banner_image"
                      onChange={handleChange}
                      className={manage.fileInput}
                      />
                  </div>
              <button onClick={() => handleSubmit(formData)}>Submit</button>
              <br />
              <br />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
