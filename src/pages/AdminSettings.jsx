import React, { useState,useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminProfile from '../components/AdminProfile';
import '../css/editform.css'
import AdminEditForm from '../components/AdminEditForm';

export default function AdminSettings() {
    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState("");
    const [alertColor, setAlertColor] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const fetchDataFromsSessionStorage = () => {
          try {
              // Retrieve data from local storage
              const data = sessionStorage.getItem('profileData');
              if (!data) {
                  setAlert("Could not fetch data of this profile!");
                  setAlertColor('#f45050');
                  throw new Error('No data found in local storage');
              }
  
              // Parse the data as JSON
              const parsedData = JSON.parse(data);
              setFormData(parsedData);
          } catch (error) {
              setAlert("Oops! Something went wrong!");
              setAlertColor('#f45050');
              console.error('Error fetching data from local storage:', error);
          }
      };
  
      fetchDataFromsSessionStorage();
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
        let url = `http://127.0.0.1:8000/api/admin/update-account/${userId}`
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
      setAlert("Password changed successfully."); 
    }else{
      setAlertColor('#f45050');
      console.log(alertColor);
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
      <AdminSidebar />
      <AdminHeader alert={alert} isVisible={isVisible} alertColor={alertColor}/>
      <div className='profile-content'>
        <AdminEditForm inputsEnabled={inputsEnabled} enableInputs={enableInputs} formData={formData} handleInputChange={handleInputChange} cancelInputs={cancelInputs} saveInputs={saveInputs} giveAlert={giveAlert}/>
        <AdminProfile formData={formData}/>
      </div>
    </div>
  )
}
