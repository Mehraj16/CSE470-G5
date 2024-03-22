import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import { useLocation } from 'react-router-dom';

export default function CreatePost() {
    const location = useLocation();
    const props = location.state;

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        pdf: null 
    });
    useEffect(() => {
      // Set the date field to today's date when the component mounts
      const currentDate = new Date().toISOString().split('T')[0];
      setFormData({ ...formData, date: currentDate });
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
  };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
  return (
    <div className='App'>
        <AdminSidebar />
        <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
        <div className='Content'>
          <h3 className={manage.headline}>Upload Your Article</h3>
        </div>
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
              <div className={manage.formDiv}>
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
                  <div>
                  <label htmlFor="banner">Article (*PDF only):</label><br />
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
    </div>
  )
}
