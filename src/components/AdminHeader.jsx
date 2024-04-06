import React from 'react'
import header from '../css/header.module.css';

export default function AdminHeader(props) {
  return (
    <div className={header.navbar}>
        <div className={header.profile}>
            <img src={props.profilepic} alt="Profile Picture" className={header.profilePic} />
        </div>
      </div>
  )
}
