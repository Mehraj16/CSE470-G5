import React ,{ useState } from 'react';
import login from './css/LoginSignup.module.css'
// import user_icon from '../assets/person.png'
// import email_icon from '../assets/email.png'
// import password_icon from '../assets/password.png'
import logo_icon from'./assets/logo.png'

const LoginSignup = () => {
    const [action,setAction]= useState("Login");
    return (
        <div className={login.container}>
    <div className={login.header}>
        <div className={login.logo}>
            <img src={logo_icon} alt=""/>
        </div>
        <div className={login.text}>
            {action}  
        </div>
        <div className={login.underline}></div>
    </div>
    <div className={login.inputs}>
        {action==="Login" ? <div></div> : <div className={login.input}>
            {/* <img src={user_icon} alt=""/> */}
            <input type="text" placeholder='Username'/>
        </div>}
        <div className={login.input}>
            {/* <img src={email_icon} alt=""/> */}
            <input type="email" placeholder='Email'/>
        </div>
        <div className={login.input}>
            {/* <img src={password_icon} alt=""/> */}
            <input type="password" placeholder='Password'/>
        </div> 
    </div>
    {action==="Sign Up" ? 
        <div className={login['submit-acc-container']}>
            <div className={login['submit-acc']}>Create Account</div>
        </div> :
        <div className={login.Account}>Don't Have Any Account?<span> <div onClick={()=>{setAction("Sign Up")}}>Sign Up Now! </div></span> </div>
    }
    <div className={login['submit-container']}>
        <div className={action==="Login" ? `${login.submit} ${login.gray}` : login.submit} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
        <div className={action==="Sign Up" ? `${login.submit} ${login.gray}` : login.submit} onClick={()=>{setAction("Login")}}>Login</div>
    </div>
</div>

    )
}
export default LoginSignup