import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cards(props) {
  const navigation = useNavigate();

  const handleClick = () => {
    navigation('../eventdetails', {state: props});
  };

  return( 
    <div className="card" style={{backgroundImage: `url(${props.image})`}} onClick={handleClick}>
      <div className="card-content">
        <h3 className='title'>{props.title}</h3>
        <p>{props.date}</p>
        <p>{props.time}</p>
      </div>
    </div>
  );
}
