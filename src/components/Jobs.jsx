import React from 'react'
import '../css/jobs.css'
import { useNavigate } from 'react-router-dom';

export default function Jobs(props) {
  const navigate = useNavigate();

  const showArticle = (props) =>{
    window.open(props.content, '_blank');
  }
  const showJob = (e, item) =>{
    e.preventDefault();
    navigate('../circular', {state: {
      props: props.profilepic,
      id: item,
    }
    });
  }
  return (
    <div onClick={(e) => (props.code === 1 && showArticle(e, props.id)) || (props.code !== 1 && showJob(e, props.id))}>
      <div className='mycards'>
        <div className='imgdiv'>
          <img src={props.image} alt="job" />
        </div>
        <div className='cards-text'>
          <h4 className='mytitle'>{props.title}</h4>
          <p>{props.type}: {props.date}</p>
        </div>
      </div>
    </div>
  );  
}
