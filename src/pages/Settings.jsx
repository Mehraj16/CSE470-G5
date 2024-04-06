import React, { useState,useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../css/profile.css'
import '../css/editform.css'
import EditForm from '../components/EditForm';
import MvvMode from '../components/MvvMode';

export default function Settings() {
    const [formData, setFormData] = useState({});
    useEffect(() => {
      const fetchDataFromLocalStorage = () => {
          try {
              // Retrieve data from local storage
              const data = localStorage.getItem('profileData');
              if (!data) {
                  throw new Error('No data found in local storage');
              }
  
              // Parse the data as JSON
              const parsedData = JSON.parse(data);
              setFormData(parsedData);

          } catch (error) {
              console.error('Error fetching data from local storage:', error);
          }
      };
  
      fetchDataFromLocalStorage();
  }, []);
    
      const handleInputChange = (field, value) => {
        setFormData(prevData => ({
          ...prevData,
          [field]: value
        }));
      };
  const [inputsEnabled, setInputsEnabled] = useState(false);

  const enableInputs = () => {
    setInputsEnabled(true);
  };
  const cancelInputs = (e) => {
    e.preventDefault();
    setInputsEnabled(false);
  }
  const saveInputs = async (e) => {
    e.preventDefault();
    
    try {
        // Prepare the updated data to be sent to the backend
        const updatedData = { ...formData };
        const userId = formData.id;
        let url = `http://127.0.0.1:8000/update-account/${userId}`
        // Send PUT request to update data in the database
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update data');
        }

        // Update profileData in localStorage with the updated data
        localStorage.setItem('profileData', JSON.stringify(updatedData));
        
        setInputsEnabled(false); // Disable form inputs after successful update
    } catch (error) {
        console.error('Error:', error);
    }
    try {
      const imageId = formData.id;   
      const url = `http://127.0.0.1:8000/images/${imageId}`;

      // Fetch image data from the backend
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error:', response.status);
        throw new Error('Failed to fetch image data');
      }
      const responseBody = await response.json();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(responseBody.profileImage))
      );
      setBackenddata(base64String);
      console.log(backenddata);
      localStorage.setItem('profileImage', base64String);

    } catch (error) {
      console.error('Error:', error);
    }
    setInputsEnabled(false);
  }
  return (
    <div className='App'>
      <MvvMode />
      <Sidebar />
      <Header profilepic={`/src/assets/${formData.profileImage}`}/>
      <div className='profile-content'>
        <EditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs} saveInputs={saveInputs}/>
        <Profile formData={formData}/>
      </div>
    </div>
  )
}
