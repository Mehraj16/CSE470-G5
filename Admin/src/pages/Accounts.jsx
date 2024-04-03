import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import manage from "../css/manage.module.css";

export default function Accounts() {
  const [profileData, setProfileData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/profile.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        setProfileData(Data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className='App'>
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${profileData.profileImage}`}/>
      <div className='Content'>
        <div>
          <h3 className={manage.headline}>Admin Accounts</h3>
        </div>
        <div className={manage.jobsCreate}>
          <div>
            <button onClick={toggleFormVisibility}>Create New Admin</button>
          </div>
          <div>
            <p>View All Admin</p>
          </div>
        </div>
        {showForm && (
          <form className={manage.formCreate}>
            <div>
              <label>Email:</label><br />
              <input type="email" />
            </div>
            <div>
              <label>Password:</label><br />
              <input type="password" />
            </div>
            <button type="submit">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}
