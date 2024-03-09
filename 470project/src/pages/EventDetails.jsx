import React from 'react';
import '../App.css';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import '../css/sidebar.css';
import '../css/header.css';
import '../css/details.css';
import Details from '../components/Details';
import { useLocation } from 'react-router-dom'


export default function EventDetails () {
  const location = useLocation();
  const props = location.state;
  return (
    <div className='App'>
      <Sidebar />
      <Header />
      <div className='Content'>
        {/* Pass props directly to the Details component */}
        <Details title={props.title} date={props.date} time={props.time} image={props.image}/>
      </div>
    </div>
  )
}
