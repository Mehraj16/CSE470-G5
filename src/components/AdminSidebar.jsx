import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { BsCalendar3Event } from "react-icons/bs"
import { VscSettings } from "react-icons/vsc";
import { IoLogOut } from "react-icons/io5";
import logo from '../assets/logo.png'
import '../css/sidebar.css';
import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  const navigateTo = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigateTo('/')
  };
  return (
    <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="Logo" width="70" />
        </div>
        <ul className="list">
          <li className='list-item'><Link to="/admin"><FaHome className='icon'/> <span>Home</span></Link></li>
          <li className='list-item'><Link to="/manage"><BsCalendar3Event className='icon'/> <span>Manage</span></Link></li>
          <li className='list-item'><Link to="/accounts"><RxDashboard className='icon'/> <span>Accounts</span></Link></li>
          <li className='list-item'><Link to="/adminsettings"><VscSettings className='icon'/> <span>Settings</span></Link></li>
          <li className='list-item'><a onClick={handleLogout} href=''><IoLogOut className='icon'/> <span>Logout</span></a></li>
      </ul>
    </div>
  )
}
