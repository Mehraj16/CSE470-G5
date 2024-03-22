import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import viewall from '../css/viewall.module.css';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';

export default function AdminEvents() {
  const location = useLocation();
  const props = location.state;

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3; // Change this according to your requirements
  const [eventClicked, setEventClicked] = useState(false); // State to track if event link is clicked

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Function to fetch data for the current page
  const fetchData = async () => {
    // For the sake of this example, fetching mock JSON data
    const response = await fetch('/eventsCreated.json');
    const jsonData = await response.json();
  
    // Filter the JSON data to include only events with the specified authorId
    const filteredData = jsonData.filter(event => event.authorId === 5);
  
    setData(filteredData);
    setTotalItems(filteredData.length); // Set total items based on the fetched data
  };
  

  // Get the index range of items to be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get the subset of data to be displayed on the current page
  const currentPageData = data.slice(startIndex, endIndex);

  // Callback function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  const showDetails = (e, eventData) => {
    e.preventDefault();
    handleEventClick(eventData);
  };
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    time: '',
    date: '',
    description: '',
    rewardPoints: 0, // Assuming reward points are numeric
    banner: null // Assuming banner is a file object
  });
  
  // Update handleEventClick to properly set formData
  const handleEventClick = (eventData) => {
    setFormData({
      ...formData,
      title: eventData.title,
      location: eventData.location,
      time: eventData.time,
      date: eventData.date,
      description: eventData.description,
      rewardPoints: eventData.rewardPoints,
      banner: eventData.banner // Assuming banner is a file object
    });
    setEventClicked(true); // Set eventClicked to true when event link is clicked
  };
  
  // Ensure handleChange function is defined to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
              <th>Event ID</th>
              <th> Event Title</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.eventId}>
                <td>{item.eventId}</td>
                <td><a className={viewall.clickToView} href="" onClick={(e) => showDetails(e, item)}>{item.title}</a></td>
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
        {eventClicked && ( // Render form only if event link is clicked
          <React.Fragment>
            <h3 className={manage.headline}>Edit Event</h3>
            <form onSubmit={handleSubmit} className={manage.eventForm}>
              <div>
              <label htmlFor="title">Title:</label><br />
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label><br />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          <div className={manage.formDiv}>
              <div>
                  <label htmlFor="time">Time:</label><br />
                  <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  />
                  </div>
                  <div>
                  <label htmlFor="date">Date:</label><br />
                  <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  />
              </div>
          </div>
            <div>
              <label htmlFor="description">Description:</label><br />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
              <div className={manage.formDiv}>
                  <div>
                      <label htmlFor="rewardPoints">Reward Points:</label><br />
                      <input
                      type="number"
                      id="rewardPoints"
                      name="rewardPoints"
                      value={formData.rewardPoints}
                      onChange={handleChange}
                      />
                  </div>
                  <div>
                  <label htmlFor="banner">Banner:</label><br />
                      <input
                      type="file"
                      id="banner"
                      name="banner"
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
