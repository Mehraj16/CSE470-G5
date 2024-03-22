import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import viewall from "../css/viewall.module.css";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
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
        <h3>
          Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
        </h3>
        <table className={viewall.viewtable}>
          <thead>
            <tr>
              <th>Post ID</th>
              <th> Article Title</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.postId}>
                <td>{item.postId}</td>
                <td>
                  <a
                    className={viewall.clickToView}
                    href=""
                    onClick={(e) => showDetails(e, item)}
                  >
                    {item.title}
                  </a>
                </td>
                <td>{item.date}</td>
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
            <h3 className={manage.headline}>Edit Article</h3>
            <form onSubmit={handleSubmit} className={manage.eventForm}>
              <div>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className={manage.formDiv}>
                <div>
                  <label htmlFor="date">Date:</label>
                  <br />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="banner">Article (*PDF only):</label>
                  <br />
                  <input
                    type="file"
                    id="pdf"
                    name="pdf"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit">Submit</button>
            </form>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
