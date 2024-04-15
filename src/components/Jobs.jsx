import React from 'react'
import '../css/jobs.css'
import { useNavigate } from 'react-router-dom';

export default function Jobs(props) {
  const navigate = useNavigate();
  const showArticle = async (e, item) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/article-pdf/${item.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  
  const showJob = (e, item) =>{
    e.preventDefault();
    console.log(item)
    navigate('../circular', {state: {
      id: item,
      image: item.banner_image
    }});
  }
  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <div onClick={(e) => (props.code === 1 && showArticle(e, props)) || (props.code === 2 && showJob(e, props))}>
      <div className='mycards'>
        <div className='imgdiv'>
          <img src={props.banner_image} alt="job" />
        </div>
        <div className='cards-text'>
          <h4 className='mytitle'>{props.positionTitle}</h4>
          <p>{props.type}: {formatDate(props.deadline)}</p>
        </div>
      </div>
    </div>
  );  
}
