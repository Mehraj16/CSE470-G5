import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { RxDashboard } from 'react-icons/rx';
import { BsCalendar3Event } from 'react-icons/bs';
import { VscSettings } from 'react-icons/vsc';
import { IoLogOut } from 'react-icons/io5';
import logo from '../assets/logo.png';
import '../css/sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {
  const jsonString = sessionStorage.getItem('profileData');
  const data = JSON.parse(jsonString);
  const id = data.id;
  const navigateTo = useNavigate();

  const handleDelete = async () => {
    if(localStorage.getItem('seenNotif')){
      console.log(localStorage.getItem('seenNotif'));
      try{
        const deleteResponse = await fetch(`http://127.0.0.1:8000/api/remove-notifs/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const deleteResponseBody = await deleteResponse.json();
        if (!deleteResponse.ok) {
          console.log(deleteResponseBody);
          throw new Error('Failed to remove request:');
        }
        console.log("deleted");
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await handleDelete();
      sessionStorage.clear();
      localStorage.clear();
      navigateTo('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" width="70" />
      </div>
      <ul className="list">
      <li className='list-item'><Link to="/home"><FaHome className='icon'/> <span>Home</span></Link></li>
      <li className='list-item'><Link to="/events"><BsCalendar3Event className='icon'/> <span>Event</span></Link></li>
      <li className='list-item'><Link to="/discover"><RxDashboard className='icon'/> <span>Discover</span></Link></li>
      <li className='list-item'><Link to="/settings"><VscSettings className='icon'/> <span>Settings</span></Link></li>
      <li className='list-item'><a onClick={(e) => handleLogout(e)} href=''><IoLogOut className='icon'/> <span>Logout</span></a></li>
    </ul>
    </div>
  );
}

export default Sidebar;
