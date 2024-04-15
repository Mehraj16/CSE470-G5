import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from '../css/manage.module.css';
import { useLocation } from 'react-router-dom';
import { MdOutlineFileUpload } from "react-icons/md";

export default function CreatePost() {
    const location = useLocation();
    const props = location.state;
    const jsonString = sessionStorage.getItem('profileData');
    const data = JSON.parse(jsonString);
    const id = data.id;
    const [alert, setAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const [selectedPDF, setSelectedPDF] = useState(null);

    const handlePDFInputChange = (file) => {
      setSelectedPDF(file);
      console.log("Selected PDF:", file); // Log the selected PDF file
    };
    
    const getPDFExtension = (filename) => {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); // Extract file extension
    };
    
    const handlePDFUpload = async (eventid) => {
      if (!selectedPDF) {
        console.error('No file selected');
        return;
      }
    
      const pdfData = new FormData();
      const extension = getPDFExtension(selectedPDF.name); // Get file extension
      const filename = `article${eventid}.${extension}`; // Dynamically set filename with the ID and original extension
      pdfData.append('pdf_file', selectedPDF, filename);
      console.log("pdfData after appending file:", pdfData);
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/upload-pdf/${eventid}`, {
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
    };
    


    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInputChange = (file) => {
      setSelectedFile(file);
      console.log("set");
    };
   
    const getFileExtension = (filename) => {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); // Extract file extension
    };
   
    const handleUpload = async (eventid) => {
      if (!selectedFile) {
        console.error('No file selected');
        return;
      }
   
      const formData = new FormData();
      const extension = getFileExtension(selectedFile.name); // Get file extension
      const filename = `post${eventid}.${extension}`; // Dynamically set filename with the ID and original extension
      formData.append('file', selectedFile, filename);
   
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/upload-article-banners/${eventid}`, {
          method: 'POST',
          body: formData,
        });
   
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file: ', error);
      }
    };

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        admin_id: id 
    });
    useEffect(() => {
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
        let url = 'http://127.0.0.1:8000/api/article/';
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
              setAlert("Oops! Something went wrong!");
                  setAlertColor('#f45050');
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
                handlePDFUpload(responseBody.id);
                handleUpload(responseBody.id);
                setAlert("Article Posted Succesfully!");
            } catch (error) {
              setAlert("Oops! Something went wrong!");
                  setAlertColor('#f45050');
                console.error('Error:', error);
            }
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
  return (
    <div className='App'>
        <AdminSidebar />
        <AdminHeader alert={alert} isVisible={isVisible} alertColor={alertColor}/>
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
                      onChange={(e) => handlePDFInputChange(e.target.files[0])}
                      className={manage.fileInput}
                      />
                  </div>
              </div>
              <div className={manage.filecontainer}>
                  <label htmlFor="banner">Event Banner:</label><br />
                  <label htmlFor="resume" className={manage.filelabel}><MdOutlineFileUpload className={manage.icon}/>&nbsp;| Choose File</label><br />
                      <input
                      type="file"
                      id="banner"
                      name="banner_image"
                      onChange={(event) => handleFileInputChange(event.target.files[0])}
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
