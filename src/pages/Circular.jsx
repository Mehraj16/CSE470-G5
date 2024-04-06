import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useLocation } from 'react-router-dom'

export default function Circular() {
  const location = useLocation();
  const props = location.state;

  const [data, setData] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        const foundItem = Data.find(item => item.id === props.id);
        if (foundItem) {
        setData(foundItem);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  const vid = 102;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/applications.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const Data = await response.json();
        const foundItem = Data.find(item => item.VolunteerID === vid & item.JobID === props.id);
        if (foundItem) {
          setStatus(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleClick = () =>{
    setIsClicked(true);
  }

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

  return (
    <div className='App'>
      
      <Sidebar />
      <Header profilepic={`/src/assets/${props}`}/>
      <div className='Content' style={{
          width: '73%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <div className='banner'>
            <img src={`/src/assets/${data.image}`} alt="eventBanner" style={{
                width: '75%',
                height: 'auto',
            }}/>
            <p>Position Title</p>
            <p>{data.positionTitle}</p>
            <p>Application deadline</p>
            <p>{formatDate(data.date)}</p>
            <p>Job Details</p>
            <p>{data.description}</p>
            <button className={`applyBtn ${isClicked ? 'active' : ''}`} 
              onClick={handleClick} disabled={status}>
              {status ? 'Applied' : (isClicked ? 'Fill out the form' : 'Apply')}</button>
              {isClicked && (
                <div className="formContainer">
                  <form>
                    <div>
                        <label htmlFor="name">Name:</label><br />
                        <input type="text" id="name" name="name"/><br /><br />
                    </div>
                    <div>
                        <label htmlFor="resume">Resume(pdf only):</label><br />
                        <input type="file" id="resume" name="resume" /><br /><br />
                    </div>
                    <div>
                        <label htmlFor="date">Date:</label><br />
                        <input type="date" id='date' name='date' defaultValue={formattedDate}/><br /><br />
                    </div>
                    <button>Submit</button>
                  </form>
                </div>
              )}
      </div>
      </div>
    </div>
  )
}
