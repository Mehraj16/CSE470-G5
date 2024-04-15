import React, { useState, useEffect } from 'react';
import login from './css/LoginSignup.module.css';
import logo_icon from './assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Alert from './components/Alert';

const LoginSignup = () => {

        const navigation = useNavigate();
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [alert, setAlert] = useState("");
        const [isVisible, setIsVisible] = useState(false);
        useEffect(() => {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setAlert("");
            }, 2000);
            return () => clearTimeout(timer);
        }, [alert]);
    
        const handleSubmit = async (event, click) => {
            event.preventDefault(); // Prevent the default form submission behavior
            if (isNaN(username)) { // Check if username is not a number (assuming ID is numeric)
                goTouserfetch(click);
            } else {
                goToadminfetch(click);
            }
        };
        
        const goTouserfetch = async (click) => {
            let url;
        
            if (click === 'login') {
                url = 'http://127.0.0.1:8000/user_login/'; // Email login API
            } else if (click === 'signup') {
                url = 'http://127.0.0.1:8000/register/'; // Log error if attempting to sign up with email   
            }

            if (password !== ''){
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
                        console.error('Failed request:', responseBody.detail); 
                        setIsVisible(true); // Set isVisible to true
                        setAlert(responseBody.detail);// Log error and response body
                        throw new Error('Failed request');
                    }
                    
                    sessionStorage.setItem('profileData', JSON.stringify(responseBody));
                    navigation("/home");
                } catch (error) {
                    console.error('Error:', error);
                }
            }else{
                setIsVisible(true); // Set isVisible to true
                setAlert("Password cannot be empty.");
            }
        };
        
        const goToadminfetch = async (click) => {
            let url;
        
            if (click === 'login') {
                url = 'http://127.0.0.1:8000/api/admin/user_login/'; // Log error if attempting to login with number
                   
            } else if (click === 'signup') {
                setIsVisible(true); // Set isVisible to true
                setAlert("You cannot sign up with user ID.");
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
                sessionStorage.setItem('profileData', JSON.stringify(responseData));
                navigation("/admin");
            } catch(error) {
                console.error('Error:', error);
                setIsVisible(true); // Set isVisible to true
                setAlert("Invalid password or username");
            }
        };
        

    return (
        <div className={login.main}>
            <div className='alert-div'>
                <Alert isVisible={isVisible} alertText={alert} alertColor={'#f45050'}/>
            </div>
            <form className={login.inputform}>
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
                <div className={login.inputs}>
                    <div className={login.input}>
                        <input type="text" id="username" name="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className={login.input}>
                        <input type="password" id="password" name="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className={login['submit-container']}>
                    <button className={login.submit} onClick={(e) => handleSubmit(e, 'login')}>Login</button>
                    <button className={login.submit} onClick={(e) => handleSubmit(e, 'signup')}>Sign Up</button>
                </div>
            </div>
            </form>
        </div>
    );
};

export default LoginSignup;
