import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import { useLocation } from "react-router-dom";

export default function CreateJob() {
    const location = useLocation();
    const props = location.state;
    const jsonString = localStorage.getItem('profileData');
    const data = JSON.parse(jsonString);
    const id = data.id;
    const [formData, setFormData] = useState({
        positionTitle: '',
        deadline: '',
        description: '',
        admin_id: id
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        // let url = 'http://127.0.0.1:8000/api/jobs/';
        // try {
        //   const response = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        // const responseBody = await response.json(); // Read response body
        //     if (!response.ok) {
        //             console.error('Failed request:', responseBody); // Log error and response body
        //             throw new Error('Failed request');
        //         }
        //       console.log("posted");
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
      };
  return (
    <div className="App">
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h3 className={manage.headline}>Create Posting</h3>
        <form onSubmit={handleSubmit} className={manage.eventForm}>
        <div className={manage.inputContainer}>
        <label htmlFor="positionTitle">Position Title:</label><br />
        <input
          type="text"
          id="positionTitle"
          name="positionTitle"
          value={formData.positionTitle}
          onChange={handleChange}
          required
          
        />
        </div>
        <div className={manage.inputContainer}>
        <label htmlFor="jobDescription">Job Description:</label><br />
        <textarea
          id="jobDescription"
          name="description"
          value={formData.jobDescription}
          onChange={handleChange}
          required
        />
        </div>
        <div className={manage.formDiv}>
            <div className={manage.inputContainer}>
                <label htmlFor="deadlineDate">Deadline Date:</label><br />
                <input
                type="date"
                id="deadlineDate"
                name="deadline"
                value={formData.deadlineDate}
                onChange={handleChange}
                required
                className={manage.dateInput}
                />
            </div>
        </div>
            <button type="submit">Create Posting</button>
            <br />
            <br />
        </form>
        </div>
      </div>
  )
}
