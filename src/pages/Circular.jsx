import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useLocation } from 'react-router-dom'
import { MdOutlineFileUpload } from "react-icons/md";
import manage from '../css/manage.module.css';

export default function Circular() {
  const location = useLocation();
  const props = location.state.id;
  const img = location.state.image;
  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  const [myName, setMyName] = useState("");
  const jsonString = sessionStorage.getItem('profileData');
  const data = JSON.parse(jsonString);
  const myid = data.id;

  useEffect(() => {
    const fetchData = async () => {
        try {
    const response = await fetch('http://127.0.0.1:8000/api/apps/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            const hasMatch = data.some(item => item.volunteer_id === myid && item.job_id === props.id);
            setStatus(hasMatch);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);


  const handleClick = () => {
    setIsClicked(true);
  }
  const handleChange = (field, e) => {
    setMyName(e.target.value);
  };

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    const [selectedPDF, setSelectedPDF] = useState(null);

    const handlePDFInputChange = (file) => {
      setSelectedPDF(file);
      console.log("Selected PDF:", file); // Log the selected PDF file
    };
    
    const getPDFExtension = (filename) => {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); // Extract file extension
    };

  const handleResumeUpload = async (jobid) =>{
    if (!selectedPDF) {
      console.error('No file selected');
      return;
    }
  
    const pdfData = new FormData();
    const extension = getPDFExtension(selectedPDF.name); // Get file extension
    const filename = `resume${jobid}.${extension}`; // Dynamically set filename with the ID and original extension
    pdfData.append('pdf_file', selectedPDF, filename);
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/upload-resume/${jobid}`, {
        method: 'POST',
        body: pdfData,
      });
  
      if (!response.ok) {
        console.log("Response error:", response);
        throw new Error('Failed to upload file');
      }
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
        "name": myName,
        "date": formattedDate,
        "admin_id": props.admin_id,
        "volunteer_id": myid,
        "job_id": props.id
    }

    let url = 'http://127.0.0.1:8000/api/apply/';
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
            const responseBody = await response.json();
            if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
              handleResumeUpload(responseBody.id);
              setIsClicked(false);
              setStatus(true);
            } catch (error) {
                console.error('Error:', error);
            }

  };

  return (
    <div className='App'>    
      <Sidebar />
      <Header />
      <div className='Content' style={{
          width: '73%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <div className='banner'>
            <img src={img} alt="eventBanner" style={{
                width: '75%',
                height: 'auto',
            }}/>
            <p><em>Position Title</em></p>
            <p>{props.positionTitle}</p>
            <p><em>Application deadline</em></p>
            <p>{formatDate(props.deadline)}</p>
            <p><em>Job Details</em></p>
            <p>{props.description}</p>
            <button className={`applyBtn ${!status ? 'active' : ''}`} 
              onClick={handleClick} disabled={status}>
              {status ? 'Applied' : (isClicked ? 'Fill out the form' : 'Apply')}</button>
              {isClicked && (
                <div className="formContainer" style={{
                  marginTop:'40px',
                  width:'75%'
                }}>
                  <h2>Fill in the details to apply:</h2>
                  <form>
                    <div className={manage.inputContainer} style={{marginBottom:'25px'}}>
                      <label htmlFor="title">Name:</label><br />
                      <input style={{width:'97%'}}
                        type="text"
                        id="title"
                        name="title"
                        onChange={(e) => handleChange('name', e)}
                      />
                    </div>
                    <div className={manage.formDiv}>
                      <div className={manage.fileBox}>
                      <label htmlFor="banner">Resume (*PDF only):</label><br />
                      <label htmlFor="resume" className={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                          <input
                          type="file"
                          id="pdf"
                          name="article"
                          className={manage.fileInput}
                          onChange={(e) => handlePDFInputChange(e.target.files[0])}
                          />
                      </div>
                      </div>
                      <br />
                      <br />
                    <button onClick={(e) => handleSubmit(e)}>Submit</button>
                  </form>
                </div>
              )}
      </div>
      </div>
    </div>
  )
}
