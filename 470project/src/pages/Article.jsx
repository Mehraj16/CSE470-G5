import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useLocation } from 'react-router-dom'
export default function Article() {
  const location = useLocation();
  const props = location.state;

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/article.json'); 
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

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }

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
           <p>Published {formatDate(data.date)}</p>
           <h3>{data.title}</h3> 
           <p>{data.author}</p>
           <div style={{
                display: 'flex',
                justifyContent: 'center',
                }}>
                <img src={data.image} alt="article" style={{
                        width: '75%',
                    }}/>
           </div>
           <br />
           <p>{data.content}</p>
      </div>
    </div>
  )
}
