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
    const [formData, setFormData] = useState({
        firstName: "John",
        lastName: "Doe",
        dob: "1990-01-01",
        city: "New York",
        email: "john@example.com",
        password: "m@ri0",
        biography: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        interests: "Coding, hiking, reading",
        skills: "JavaScript, React, HTML, CSS"
      });
    
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
  return (
    <div className='App'>
      <Sidebar />
      <div className='profile-content'>
        <EditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs}/>
        <Profile />
      </div>
    </div>
  )
}
