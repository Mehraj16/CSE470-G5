import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import { useLocation } from "react-router-dom";
import { MdOutlineFileUpload } from "react-icons/md";

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
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          required
        />
        </div>
        <div className={manage.inputContainer}>
        <label htmlFor="jobRequirements">Job Requirements:</label><br />
        <textarea
          id="jobRequirements"
          name="jobRequirements"
          value={formData.jobRequirements}
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
                name="deadlineDate"
                value={formData.deadlineDate}
                onChange={handleChange}
                required
                className={manage.dateInput}
                />
            </div>
            <div className={manage.filecontainer}>
              <label>CV(*PDF only):</label><br />
              <label htmlFor="resume" class={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className={manage.fileInput}
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
