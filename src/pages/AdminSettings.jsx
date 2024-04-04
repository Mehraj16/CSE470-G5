import React, { useState,useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminProfile from '../components/AdminProfile';
import '../css/editform.css'
import AdminEditForm from '../components/AdminEditForm';

export default function AdminSettings() {
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
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${formData.profileImage}`}/>
      <div className='profile-content'>
        <AdminEditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs}/>
        <AdminProfile formData={formData}/>
      </div>
    </div>
  )
}
