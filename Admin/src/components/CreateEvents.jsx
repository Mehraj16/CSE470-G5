import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import { useLocation } from 'react-router-dom';

export default function CreateEvents() {
 const location = useLocation();
 const props = location.state;

 const [formData, setFormData] = useState({
        title: '',
        location: '',
        time: '',
        date: '',
        description: '',
        rewardPoints: 0,
        banner: null 
    });

 const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
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
    </div>
    </div>
  )
}
