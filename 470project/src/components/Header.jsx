import React from 'react'

export default function Header(props) {
  return (
    <div className="navbar">
        <div className="profile">
            <button className="chat-button">Chat</button>
            <img src={props.profilepic} alt="Profile Picture" className="profile-pic" />
        </div>
      </div>
  )
}
