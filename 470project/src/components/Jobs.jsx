import React from 'react'
import '../css/jobs.css'
import { useNavigate } from 'react-router-dom';

export default function Jobs(props) {
  const navigate = useNavigate();

  const showArticle = (e, item) =>{
    e.preventDefault();
    navigate('../article', {state: {
      props: props.profilepic,
      id: item,
    }
    });
  }
  return (
    <div onClick={(e) => showArticle(e, props.id)}>
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
  )
}
