import React, { useState, useEffect } from 'react';

export default function MvvMode() {
    const [MVV, setMVV] = useState(false);
    const data = sessionStorage.getItem('profileData');
    const parsedData = JSON.parse(data);
    const mydata = parsedData;

    const setMVVMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'mvv');
    }
    const setNormalMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'normal');
    }
    useEffect(() => {
        fetchData();
      }, []);
    const fetchData = async () =>{
        let url = `http://127.0.0.1:8000/api/mvv/`;
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          const responseBody = await response.json();
              if (!response.ok) {
                      throw new Error('Failed request');
                  }
                if(mydata.id === responseBody[0].id){
                    setMVV(true);
                }
          } catch (error) {
                  console.error('Error:', error);
          }  
    }
    useEffect(() => {
        if(MVV){
            setMVVMode();
        }
        else{
            setNormalMode();
        }
        localStorage.setItem('mvv', MVV);
    }, [MVV]); 
    
  return (
    <div>
      
    </div>
  )
}
