import React from 'react';
import '../css/cards.css'

export default function Cards(props) {
  return( 
    <div className="card" style={{backgroundImage: `url(${props.image})`}} onClick={props.click}>
      <div className="card-content">
        <h3 className='title'>{props.title}</h3>
        <p>{props.date}</p>
        {(props.time)?
          <p>{props.time}</p>
          :
          ''
        }
      </div>
    </div>
  );
}
