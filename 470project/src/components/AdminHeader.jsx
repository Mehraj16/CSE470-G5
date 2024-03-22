import React from 'react'
import '../css/header.css';

export default function AdminHeader(props) {
  return (
    <div className="navbar">
        <div className="profile">
            <button className="chat-button">Chat</button>
            <img src={props.profilepic} alt="Profile Picture" className="profile-pic" />
        </div>
      </div>
  )
}
