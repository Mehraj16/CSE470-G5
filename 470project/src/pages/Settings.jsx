import React, { useState,useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../css/profile.css'
import '../css/editform.css'
import EditForm from '../components/EditForm';

export default function Settings() {
    const [formData, setFormData] = useState({});
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/profile.json');// test file used in public folder
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setFormData(data);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
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

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${formData.profileImage}`}/>
      <div className='profile-content'>
        <EditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs}/>
        <Profile formData={formData}/>
      </div>
    </div>
  )
}
