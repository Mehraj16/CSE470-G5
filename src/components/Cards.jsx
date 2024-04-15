import React from 'react';
import '../css/cards.css';

export default function Cards(props) {
  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }

  return( 
    <div className="card" style={{backgroundImage: `url(${props.banner_image})`}} onClick={props.click}>
      <div className="card-content">
        <h3 className='title'>{props.title}</h3>
        <p>{formatDate(props.date)}</p>
        {(props.time) &&
          <p>{props.time}</p>
        }
      </div>
    </div>
  );
}
