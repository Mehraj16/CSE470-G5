import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import { useLocation } from 'react-router-dom';
import { MdOutlineFileUpload } from "react-icons/md";

export default function CreatePost() {
    const location = useLocation();
    const props = location.state;
    const jsonString = localStorage.getItem('profileData');
    const data = JSON.parse(jsonString);
    const id = data.id;
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        banner_image: null,
        article: null,
        admin_id: id 
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = 'http://127.0.0.1:8000/api/post/';
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
  return (
    <div className='App'>
        <AdminSidebar />
        <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
        <div className='Content'>
          <h3 className={manage.headline}>Upload Your Article</h3>
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
                      name="article"
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
              <button onClick={handleSubmit}>Submit</button>
              <br />
              <br />
        </form>
        </div>
    </div>
  )
}
