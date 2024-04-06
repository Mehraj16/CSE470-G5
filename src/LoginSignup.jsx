import React, { useState } from 'react';
import login from './css/LoginSignup.module.css';
import logo_icon from './assets/logo.png';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {

        const navigation = useNavigate();
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [action, setAction] = useState("");
    
        const handleSubmit = async (event, click) => {
            event.preventDefault(); // Prevent the default form submission behavior
            setAction(click);
            console.log(click)
            if (isNaN(username)) { // Check if username is not a number (assuming ID is numeric)
                goTouserfetch();
            } else {
                goToadminfetch();
            }
        };
        
        const goTouserfetch = async () => {
            let url;
        
            if (action === 'login') {
                url = 'http://127.0.0.1:8000/user_login/'; // Email login API
            } else if (action === 'signup') {
                url = 'http://127.0.0.1:8000/register/'; // Log error if attempting to sign up with email   
            }

            const requestBody = {
                "email": username,
                "password_hash": password
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                const responseBody = await response.json(); // Read response body
        
                if (!response.ok) {
                    console.error('Failed request:', responseBody); // Log error and response body
                    throw new Error('Failed request');
                }
                localStorage.setItem('profileData', JSON.stringify(responseBody));
                navigation("/home");
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        const goToadminfetch = async () => {
            let url;
        
            if (action === 'login') {
                url = 'http://127.0.0.1:8000/api/admin/user_login/'; // Log error if attempting to login with number
                   
            } else if (action === 'signup') {
                console.error('Cannot  with number'); 
                return;
            }
            const requestBody = {
                "id": parseInt(username), // Assuming ID is numeric
                "password": password
            };
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
        
                const responseData = await response.json(); // Read response body
        
                if (!response.ok) {
                    console.error('Failed request:', responseData); // Log error and response body
                    throw new Error('Failed request');
                }
                console.log(responseData)
                localStorage.setItem('profileData', JSON.stringify(responseData));
                navigation("/admin");
            } catch (error) {
                console.error('Error:', error);
            }
        };
        

    return (
        <div className={login.container}>
            <div className={login.header}>
                <div className={login.logo}>
                    <img src={logo_icon} alt=""/>
                </div>
                <div className={login.text}>
                    Login
                </div>
                <div className={login.underline}></div>
            </div>
            <form>
                <div className={login.inputs}>
                    <div className={login.input}>
                        <input type="text" id="username" name="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className={login.input}>
                        <input type="password" id="password" name="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className={login['submit-container']}>
                    <button type="submit" className={login.submit} onClick={(e) => handleSubmit(e, 'login')}>Login</button>
                </div>
                <div className={login['submit-container']}>
                    <button type="submit" className={login.submit} onClick={(e) => handleSubmit(e, 'signup')}>Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default LoginSignup;
