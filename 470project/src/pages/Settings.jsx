import React, { useState,useEffect } from 'react'
import '../App.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../css/sidebar.css'
import '../css/header.css'
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
    console.log("Button clicked!");
    setInputsEnabled(true);
    console.log(inputsEnabled);
  };
  const cancelInputs = () => {
    console.log("Button clicked!");
    setInputsEnabled(false);
    console.log(inputsEnabled);
  }
  const [selectedGender, setSelectedGender] = useState(formData.gender);
  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    handleInputChange('gender', e.target.value);
  };

  return (
    <div className='App'>
      <Sidebar />
      <div className='profile-content'>
        <EditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs} selectedGender={selectedGender} handleGenderChange={handleGenderChange}/>
        <Profile formData={formData}/>
      </div>
    </div>
  )
}
