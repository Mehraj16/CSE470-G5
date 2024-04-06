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
    const response = await fetch("/postCreated.json");
    const jsonData = await response.json();
    const filteredData = jsonData.filter((event) => event.authorId === 5);

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
    handleEventClick(eventData);
  };
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    pdf: null 
  });

  const handleEventClick = (eventData) => {
    setFormData({
      ...formData,
      title: eventData.title,
      date: eventData.date,
      pdf: eventData.pdf 
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
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
              <span className={requests.column}>{item.postId}</span>
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
            <form onSubmit={handleSubmit} className={manage.eventForm}>
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
                  <div>
                  <label htmlFor="banner">Article (*PDF only):</label><br />
                  <label htmlFor="resume" class={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="pdf"
                      name="pdf"
                      onChange={handleChange}
                      className={manage.fileInput}
                      />
                  </div>
            </div>
              <button type="submit">Submit</button>
              <br />
              <br />
            </form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
