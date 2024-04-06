import React from 'react'

export default function MvvMode() {
    const MVV = localStorage.getItem('mvv');
    const setMVVMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'mvv');
    }
    const setNormalMode = () =>{
        document.querySelector("body").setAttribute('data-theme', 'normal');
    }
    if(MVV){
        setMVVMode();
    }
    else{
        setNormalMode();
    }
  return (
    <div>
      
    </div>
  )
}
