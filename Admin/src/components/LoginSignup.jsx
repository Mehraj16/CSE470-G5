import React ,{ useState } from 'react';
import './LoginSignup.css'
import user_icon from '../Assests/person.png'
import email_icon from '../Assests/email.png'
import password_icon from '../Assests/password.png'
import logo_icon from'../Assests/Logo.png'
const LoginSignup = () => {
    const [action,setAction]= useState("Login");
    return (
        <div className='container'>
            <div className='header'>
            <div className='logo'>
                <img src={logo_icon} alt=""/>
            </div>
                <div className='text'>
                  {action}  
                </div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action==="Login"?<div></div>:<div className='input'>
             <img src={user_icon} alt=""/>
             <input type="text" placeholder='Username'/>
            </div>}
            
            <div className='input'>
             <img src={email_icon} alt=""/>
             <input type="email"placeholder='Email'/>
            </div>
            <div className='input'>
             <img src={password_icon} alt=""/>
             <input type="password"placeholder='Password'/>
            </div> 
            </div>
            {action==="Sign Up"?<div className="submit-acc-container"><div className="submit-acc">Create Account</div></div>:<div className="Account">Don't Have Any Account?<span> <div onClick={()=>{setAction("Sign Up")}}>Sign Up Now! </div></span> </div>}
            <div className='submit-container'>
                <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}
export default LoginSignup