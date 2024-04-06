import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import { useLocation } from 'react-router-dom';
import { MdOutlineFileUpload } from "react-icons/md";

export default function CreateEvents() {
 const location = useLocation();
 const props = location.state;
 const jsonString = localStorage.getItem('profileData');
 const data = JSON.parse(jsonString);
 const id = data.id;
 const [formData, setFormData] = useState({
        title: '',
        location: '',
        time: '',
        date: '',
        description: '',
        rewards: 0,
        banner_image: null,
        admin_id: id
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
      let url = 'http://127.0.0.1:8000/api/events/';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      });
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
      <h3 className={manage.headline}>Create Your Event</h3>
            <form className={manage.eventForm}>
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
                      name="rewards"
                      value={formData.rewards}
                      onChange={handleChange}
                      min="0"
                      />
                  </div>
                  <div className={manage.filecontainer}>
                  <label htmlFor="banner">Event Banner:</label><br />
                  <label htmlFor="resume" class={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="banner"
                      name="banner_image"
                      onChange={handleChange}
                      className={manage.fileInput}
                      />
                  </div>
            </div>
              <button onClick={handleSubmit}>Create Event</button>
              <br />
              <br />
            </form>
    </div>
    </div>
  )
}
