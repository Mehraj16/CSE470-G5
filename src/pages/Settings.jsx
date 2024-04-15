import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Profile from '../components/Profile';
import '../css/profile.css'
import '../css/editform.css'
import EditForm from '../components/EditForm';
import MvvMode from '../components/MvvMode';

export default function Settings() {

    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const [isVisible, setIsVisible] = useState(false);    

    useEffect(() => {
      const fetchDataFromSessionStorage = () => {
          try {
              // Retrieve data from local storage
              const data = sessionStorage.getItem('profileData');
              if (!data) {
                  throw new Error('No data found in local storage');
              }
              const parsedData = JSON.parse(data);
              setFormData(parsedData);

          } catch (error) {
              console.error('Error fetching data from local storage:', error);
          }
      };
  
      fetchDataFromSessionStorage();
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
            setAlert("Oops! Something went wrong!");
            setAlertColor('#f45050');
            throw new Error('Failed to update data');
        }
        sessionStorage.setItem('profileData', JSON.stringify(updatedData));
        setAlert("Changes Saved Successfully");
        setInputsEnabled(false); 
    } catch (error) {
        setAlert("Oops! Something went wrong!");
        setAlertColor('#f45050');
        console.error('Error:', error);
    }
    setInputsEnabled(false);
  }
  const giveAlert = (type) =>{
    if(type){
      setAlert("Password changed successfully.")
    }else{
      setAlertColor('#f45050');
      setAlert("Something went wrong.");
    } 
  }
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
      <MvvMode />
      <Sidebar />
      <Header alert={alert} isVisible={isVisible} alertColor={alertColor}/>
      <div className='profile-content'>
        <EditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs} saveInputs={saveInputs} giveAlert={giveAlert}/>
        <Profile formData={formData} />
      </div>
    </div>
  )
}
