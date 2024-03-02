import React from 'react'

export default function Cards(props) {
   return( 
    <div className="card" style={{backgroundImage: `url(${props.image})`}}>
      <div className="card-content">
        <h3 className='title'>{props.title}</h3>
        <p>{props.date}</p>
        <p>{props.time}</p>
      </div>
    </div>
)
}
