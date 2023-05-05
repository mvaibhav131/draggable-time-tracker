import React from 'react';
import './timer.scss';
import IdleTimer from 'react-idle-timer';
import { useEffect, useState } from 'react';
import { IdleTimerComponent } from 'react-idle-timer';

const Timer = () => {
  // react hooks
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hr, setHr] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [idle, setIdle] = useState(false);

  // set initial time value is null
  let time = null;
  let idleTime = 180 * 1000; // set the idle Time for 3 minutes
  // Set the function is checking the idle Time

   // Setting the HH:MM:SS TIME
  useEffect(() => {
    if (isActive && !idle) {
      time = setInterval(() => {
        setSec(sec + 1);
        if (sec === 59) {
          setMin(min + 1);
          setSec(0);
        }
        if (min === 59) {
          setHr(hr + 1);
          setMin(0);
          setSec(0);
        }
      },1000);
    }
    return () => clearInterval(time);
  })

  function check() {
    if (window.onmousemove || window.onkeypress> idleTime) {
      setIdle(true);
      setIsActive(false);
    } else {
      setIdle(false);
      setIsActive(true);
      setSec(sec + 1);
      // is check the sec should start previous pause
    };
  };
  // Function to check Idle time every second
(setInterval(()=>{
  check()
},idleTime))
  
  

  return (
    <>
      {idle ? (
        <h1 className="idlebutton">IDLE</h1>
      ) : (
        <div className="app">
          <div className="time">
            <h1>HH:MM:SS</h1>
            <h2>
              {hr < 10 ? '0' + hr : hr}:{min < 10 ? '0' + min : min}:
              {sec < 10 ? '0' + sec : sec}
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;
