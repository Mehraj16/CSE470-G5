import React, { useState, useEffect } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'
import manage from "../css/manage.module.css";
export default function Accounts() {
  const [profileData, setProfileData] = useState([]);
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
            <p>Create New Admin</p>
          </div>
          <div>
            <p>View All Admin</p>
          </div>
      </div>
      </div>
    </div>
  )
}
