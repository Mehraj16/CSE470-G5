import React from 'react'
import { FaHome } from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { BsCalendar3Event } from "react-icons/bs"
import { VscSettings } from "react-icons/vsc";
import { IoLogOut } from "react-icons/io5";
import logo from '../assets/logo.png'
import '../css/sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="Logo" width="70" />
        </div>
        <ul className="list">
            <li className='list-item'><FaHome className='icon'/><a href="/">Home</a></li>
            <li className='list-item'><BsCalendar3Event className='icon'/><a href="/events">Event</a></li>
            <li className='list-item'><RxDashboard className='icon'/><a href="/discover">Discover</a></li>
            <li className='list-item'><VscSettings className='icon'/><a href="/settings">Settings</a></li>
            <li className='list-item'><IoLogOut className='icon'/><a href="/">Logout</a></li>
        </ul>
    </div>
  )
}

export default Sidebar
