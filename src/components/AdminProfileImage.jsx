import React, { useState, useEffect } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import manage from '../css/manage.module.css';

export default function AdminProfileImage() {
    const jsonString = sessionStorage.getItem('profileData');
    const mydata = JSON.parse(jsonString);
    const id = mydata.id;
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInputChange = (file) => {
      setSelectedFile(file);
      console.log("set")
    };
  
    const getFileExtension = (filename) => {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); // Extract file extension
    };
  
    const handleUpload = async () => {
      if (!selectedFile) {
        console.error('No file selected');
        return;
      }
  
      const formData = new FormData();
      const extension = getFileExtension(selectedFile.name); // Get file extension
      const filename = `pro-pic${id}.${extension}`; // Dynamically set filename with the ID and original extension
      formData.append('file', selectedFile, filename);
  
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/upload-admin-images/${id}`, {
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
    
  return (
    <div>
      <h3 className='settings-headers'>Update Profile Image</h3>
      <div className={manage.fileBox} style={{
                display: 'flex',
                justifyContent: 'space-around'
            }}>
            <label htmlFor="pro-pic" className={manage.filelabel} style={{
                padding:'5px 8px',
                paddingLeft: '4px'
            }}><MdOutlineFileUpload className={manage.icon} style={{
                width: '18x',
                height: '18px'
            }}/>&nbsp;| Choose File</label><br />
            <input
            type="file"
            onChange={(event) => handleFileInputChange(event.target.files[0])}
            className={manage.fileInputProf}
            />
            <div><button onClick={handleUpload}>Submit</button></div>
        </div>
        <br /><br />
    </div>
  )
}
