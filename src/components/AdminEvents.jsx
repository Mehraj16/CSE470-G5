import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import viewall from '../css/viewall.module.css';
import Pagination from '../components/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import requests from'../css/requests.module.css';
import { MdOutlineFileUpload } from "react-icons/md";

function DeleteEventPopup({ onCancel, onConfirm }) {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Are you sure you want to delete this event?</h3>
        <p>Deleting the event will send a notification to all the volunteers who signed up.</p>
        <div className="btn-group">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
function SaveChangesPopup({ onClose, event }) {
  const [sendNotif, setSendNotif] = useState(false);

  const handleCheckboxChange = (event) => {
    setSendNotif(event.target.checked);
  };

  const handleSend = () => {
    onClose();
    if (sendNotif) {
      // Set state to true and display a message
      console.log(`Has edited ${event}`);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Are you sure you want to make these changes?</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            name="notif-confirm"
            id="notif-confirm"
            onChange={handleCheckboxChange}
          />
          <p style={{ fontSize: '17px' }}>Send a notification to those signed up</p>
        </div>
        <div className={manage.formDiv} style={{ width: '80%' }}>
          <button className="del-btn" onClick={onClose}>Cancel</button>
          <button className="change-btn" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
export default function AdminEvents() {
  const location = useLocation();
  const props = location.state;

  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 7; // Change this according to your requirements
  const [eventClicked, setEventClicked] = useState(false); // State to track if event link is clicked

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    const response = await fetch('/eventsCreated.json');
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

  navigation = useNavigate();
  const goToInvites = (profileImage, eventId) =>{
    navigation('../invitations',{ state: { profileImage, eventId } })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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
    rewardPoints: 0, 
    banner: null
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
      banner: eventData.banner 
    });
    setEventClicked(true); 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const [showPopup, setShowPopup] = useState(false);
  const [event, setEvent] = useState(null);
  const handlePopupToggle = (event) => {
        setShowPopup(!showPopup);
        setEvent(event);
    };
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const handleDeleteEvent = () =>{
    setShowDeletePopup(true);
  }
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
};

const handleConfirmDelete = () => {
    // Add logic to delete the account here
    // You can make an API call or perform any other action

    // After deletion, close the popup
    setShowDeletePopup(false);
};
  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h2>Your Active Events</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div className={requests.eventContainer}>
          <div className={requests.row}>
            <span className={requests.column} id={requests.head}>Event ID</span>
            <span className={requests.column} id={requests.head}>Event Name</span>
            <span className={requests.columnbtn} id={requests.head}>Send Invitations</span>
          </div>
            {currentPageData.map((item) => (
              <div key={item.eventId} className={requests.row}>
                <span className={requests.column}>{item.eventId}</span>
                <span className={requests.column}><a className={viewall.clickToView} href="" onClick={(e) => showDetails(e, item)}>{item.title}</a></span>
                <span className={requests.columnbtn}><button onClick={() => goToInvites(props.profileImage, item.eventId)}>Select</button></span>
              </div>
            ))}
        </div>
      
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
        {eventClicked && ( // Render form only if event link is clicked
          <React.Fragment>
            <h3 className={manage.headline}>Edit Event</h3>
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
            <div className={manage.inputContainer}>
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
              <div className={manage.inputContainer}>
                  <label htmlFor="time">Time:</label><br />
                  <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={manage.dateInput}
                  />
                  </div>
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
          </div>
            <div className={manage.inputContainer}>
              <label htmlFor="description">Description:</label><br />
              <textarea className='desc'
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
              <div className={manage.formDiv}>
                  <div className={manage.inputContainer}>
                      <label htmlFor="rewardPoints">Reward Points:</label><br />
                      <input
                      type="number"
                      id="rewardPoints"
                      name="rewardPoints"
                      value={formData.rewardPoints}
                      onChange={handleChange}
                      min="0"
                      />
                  </div>
                  <div className={manage.filecontainer}>
                  <label htmlFor="banner">Event Banner:</label><br />
                  <label htmlFor="resume" className={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="banner"
                      name="banner"
                      onChange={handleChange}
                      className={manage.fileInput}
                      />
                  </div>
            </div>
              <div className={manage.formDiv} style={{justifyContent: 'space-evenly'}}>
                <button onClick={() => handlePopupToggle(formData.title)}>Save Changes</button>
                <button className='del-btn' onClick={handleDeleteEvent}>Delete Event</button>
              </div>
              <br />
              <br />
            </form>
            {showPopup && <SaveChangesPopup onClose={handlePopupToggle} event={event} />}
            {showDeletePopup && (
                    <DeleteEventPopup
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    />
              )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
