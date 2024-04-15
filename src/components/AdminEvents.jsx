import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import viewall from '../css/viewall.module.css';
import Pagination from '../components/Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import requests from'../css/requests.module.css';
import { MdOutlineFileUpload } from "react-icons/md";

function DeleteEventPopup({ onCancel, onConfirm, fetchDataAndPostData, event }) {
  const deleteEvent = async(event) =>{
    let event_id = event.id;
    try{
      const deleteResponse = await fetch(`http://127.0.0.1:8000/api/events/${event_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const deleteResponseBody = await deleteResponse.json();
        if (!deleteResponse.ok) {
          console.log(deleteResponseBody);
          throw new Error('Failed to remove request:');
        }
        window.location.reload();
      } catch (error) {
        console.error('Error:', error);
      }
  }
  const handleDelete = async() =>{
    let mes = `${event.title} has been cancelled.`
    fetchDataAndPostData(event, mes);
    deleteEvent(event);
    onConfirm();
  }
  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Are you sure you want to delete this event?</h3>
        <p>Deleting the event will send a notification to all the volunteers who signed up.</p>
        <div className="btn-group">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleDelete}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
function SaveChangesPopup({ onClose, event, submitForm, fetchDataAndPostData }) {
  const [sendNotif, setSendNotif] = useState(false);

  const handleCheckboxChange = (event) => {
    setSendNotif(event.target.checked);
  };
  
  const handleSend = async () => {
    onClose();
    if (sendNotif) {
      let mes =`${event.title} has been edited. Request again if you are still interested.`;
      submitForm(event);
      fetchDataAndPostData(event, mes);
    }else{
      submitForm(event);
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
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const admin_id = mydata.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;
  const [eventClicked, setEventClicked] = useState(false);
  const [alert, setAlert] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [isVisible, setIsVisible] = useState(false);

    async function fetchDataAndPostData(event, mes) {
      try {
        // Fetch data from events-signed-up API
        let url = 'http://127.0.0.1:8000/api/events-signed-up/';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events data');
        }
        const eventsResponse = await response.json();
        console.log("about to post")
        postDataForVolunteer(event.id, mes);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    async function postDataForVolunteer(eventId, mes) {
      try {
          const postData = {
            admin_id: admin_id,
            id: eventId,
            Message: mes,
          };
    
          // Make a POST request to the other API for each volunteerId
          const response = await fetch('http://127.0.0.1:8000/api/notifications-for-all/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
    
          if (!response.ok) {
            throw new Error(`Failed to post data for volunteer ${volunteerId}`);
          }
          console.log("Posted note")
      } catch (error) {
        console.error('Error:', error);
      }
    }
      
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    let url = 'http://127.0.0.1:8000/api/events-with-dates/';
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
              console.log(filteredData)

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

  navigation = useNavigate();
  const goToInvites = (event) =>{
    navigation('../invitations',{ state: event })
  }

  const handleSubmit = async (eventDetails) => {
    const eventId = eventDetails.id;
    let url = `http://127.0.0.1:8000/api/events/${eventId}/`;
        try {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        const responseBody = await response.json(); // Read response body
            if (!response.ok) {
              setAlert("Oops! Something went wrong!");
              setAlertColor('#f45050');
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
              console.log("posted");
              setAlert("Changes Saved Successfully");

            } catch (error) {
              setAlert("Oops! Something went wrong!");
              setAlertColor('#f45050');
              console.error('Error:', error);
            }
  };
  
  const showDetails = (e, eventData) => {
    e.preventDefault();
    handleEventClick(eventData);
  };
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    location: '',
    time: '',
    date: '',
    description: '',
    rewards: 0, 
    banner_image: null
  });
  
  // Update handleEventClick to properly set formData
  const handleEventClick = (eventData) => {
    setFormData({
      ...formData,
      id: eventData.id,
      title: eventData.title,
      location: eventData.location,
      time: eventData.time,
      date: eventData.date,
      description: eventData.description,
      rewards: eventData.rewards,
      banner_image: eventData.banner_image,
      admin_id: admin_id 
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
  const handleDeleteEvent = (event) =>{
    setShowDeletePopup(true);
    setEvent(event);
  }
  const handleCancelDelete = () => {
    setShowDeletePopup(false);
};

const handleConfirmDelete = () => {
    setShowDeletePopup(false);
};
useEffect(() => {
  setIsVisible(true);
  const timer = setTimeout(() => {
      setIsVisible(false);
      setAlert("");
      setAlertColor("");
  }, 2000);
  return () => clearTimeout(timer);
}, [alert]);

const goToSignUps = (formdata) => {
  console.log(formdata)
  navigation('../signups', { state: formdata });
}

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader alert={alert} isVisible={isVisible} alertColor={alertColor}/>
      <div className='Content'>
        <h2>Your Active Events</h2>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
        <div key={admin_id} className={requests.eventContainer}>
          <div className={requests.row}>
            <span className={requests.column} id={requests.head}>Event ID</span>
            <span className={requests.column} id={requests.head}>Event Name</span>
            <span className={requests.columnbtn} id={requests.head}>Send Invitations</span>
          </div>
            {currentPageData.map((item) => (
              <div key={item.id} className={requests.row}>
                <span className={requests.column}>{item.id}</span>
                <span className={requests.column}><a className={viewall.clickToView} href="" onClick={(e) => showDetails(e, item)}>{item.title}</a></span>
                <span className={requests.columnbtn}><button onClick={() => goToInvites(item)}>Select</button></span>
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
            <div style={{margin:'2em'}}><button onClick={() => goToSignUps(formData)}>See Sign Ups</button></div>
            <h3 className={manage.headline}>Edit Event</h3>
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
                  <div className={manage.inputContainer} style={{width: '50%'}}>
                      <label htmlFor="rewardPoints">Reward Points:</label><br />
                      <input
                      type="number"
                      id="rewardPoints"
                      name="rewards"
                      value={formData.rewards}
                      onChange={handleChange}
                      min="0"
                      />
                  </div>
            </div>
              <div className={manage.formDiv} style={{justifyContent: 'space-evenly'}}>
                <button onClick={() => handlePopupToggle(formData)}>Save Changes</button>
                <button className='del-btn' onClick={() => handleDeleteEvent(formData)}>Delete Event</button>
              </div>
              <br />
              <br />
            </div>
            {showPopup && <SaveChangesPopup onClose={handlePopupToggle} event={event} submitForm={handleSubmit} fetchDataAndPostData={fetchDataAndPostData}/>}

            {showDeletePopup && (
                    <DeleteEventPopup
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    fetchDataAndPostData={fetchDataAndPostData}
                    event={event}
                    />
                    
              )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
