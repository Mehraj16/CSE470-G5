import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import { useLocation } from "react-router-dom";

export default function CreateJob() {
    const location = useLocation();
    const props = location.state;

    const [formData, setFormData] = useState({
        positionTitle: '',
        deadlineDate: '',
        jobDescription: '',
        jobRequirements: '',
        resume: null
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, resume: file });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form data, formData will contain the entered data and selected file
        console.log('Form submitted with data:', formData);
        // You can perform further submission logic here
      };
  return (
    <div className="App">
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${props.profileImage}`} />
      <div className='Content'>
        <h3 className={manage.headline}>Upload Your Article</h3>
      </div>
        <form onSubmit={handleSubmit} className={manage.eventForm}>
        <div>
        <label htmlFor="positionTitle">Position Title:</label>
        <input
          type="text"
          id="positionTitle"
          name="positionTitle"
          value={formData.positionTitle}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="jobDescription">Job Description:</label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          required
        />
        </div>
        <div>
        <label htmlFor="jobRequirements">Job Requirements:</label>
        <textarea
          id="jobRequirements"
          name="jobRequirements"
          value={formData.jobRequirements}
          onChange={handleChange}
          required
        />
        </div>
        <div className={manage.formDiv}>
            <div>
                <label htmlFor="deadlineDate">Deadline Date:</label>
                <input
                type="date"
                id="deadlineDate"
                name="deadlineDate"
                value={formData.deadlineDate}
                onChange={handleChange}
                required
                />
            </div>
            <div>
                <label htmlFor="resume">CV(*PDF only):</label>
                <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                required
                />
            </div>
        </div>
            <button type="submit">Submit Application</button>
        </form>
      </div>
  )
}
