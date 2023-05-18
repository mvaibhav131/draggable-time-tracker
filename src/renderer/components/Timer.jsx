import React,{useRef} from 'react';
import './timer.scss';
import { useIdleTimer } from "react-idle-timer";
import { useEffect, useState } from 'react';
import { IdleTimerComponent } from 'react-idle-timer';

function Timer() {
  // react hooks
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hr, setHr] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [idle, setIdle] = useState(false);
  const idleTimeRef = useRef(null);
  // set initial time value is null
  
  let time = null;
  // Set the function is checking the idle Time

  const onIdle = () => {
    alert('You are Idle!');
    //  setIdle(!idle);
  };

  const idletimer = useIdleTimer({
    crossTab: true,
    ref: idleTimeRef,
    timeout: 60 * 1000,  // Set idle time  1min 
    onIdle: onIdle,
  });

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
  });

  return (
    <div idleTimer={idletimer}>
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
    </div>
  );
};
export default Timer;
