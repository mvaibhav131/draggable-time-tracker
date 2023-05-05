import React from 'react';
import "./timer.scss";
import { useEffect, useState } from 'react';


const Timer = () => {

    const [sec,setSec]=useState(0);
    const [min,setMin]=useState(0);
    const [hr,setHr]=useState(0);
    const [isActive,setIsActive]=useState(true);
  
    let time=null;
  
    useEffect(()=>{
       if (isActive){
     time=setInterval(()=>{
      setSec(sec+1)
      if(sec===59){
        setMin(min+1)
        setSec(0)
      }
      if(min===59){
        setHr(hr+1)
        setMin(0)
        setSec(0)
      }
      },1000)
    }
      return ()=> clearInterval(time)
    });

  return (
    <>
    <div className='app'>
    <div className='time'>
      <h2>{hr<10?"0"+hr:hr}:{min<10?"0"+min:min}:{sec<10?"0"+sec:sec}</h2>
      </div>
    </div>
    </>
  )
}

export default Timer