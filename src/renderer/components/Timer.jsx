import React, { useRef, useEffect, useState } from 'react';
import './timer.scss';
// eslint-disable-next-line import/no-duplicates
import { useIdleTimer } from 'react-idle-timer';
// eslint-disable-next-line no-unused-vars, import/no-duplicates
import { IdleTimerComponent } from 'react-idle-timer';

function Timer() {
  // react hooks
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hr, setHr] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isActive, setIsActive] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [idle, setIdle] = useState(false);
  const idleTimeRef = useRef(null);
  // set initial time value is null
  let time = null;
  // Set the function is checking the idle Time
  const onIdle = () => {
    // eslint-disable-next-line no-alert
    alert('You are Idle!');
    //  setIdle(!idle);
  };
  const idletimer = useIdleTimer({
    crossTab: true,
    ref: idleTimeRef,
    timeout: 60 * 1000, // Set idle time  1min
    onIdle,
  });
  // Setting the HH:MM:SS TIME
  useEffect(() => {
    if (isActive && !idle) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      }, 1000);
    }
    return () => clearInterval(time);
  });

  return (
    // eslint-disable-next-line react/no-unknown-property
    <div idleTimer={idletimer}>
      {idle ? (
        <h1 className="idlebutton">IDLE</h1>
      ) : (
        <div className="app">
          <div className="time">
            <h1>HH:MM:SS</h1>
            <h2>
              {hr < 10 ? `0${hr}` : hr}:{min < 10 ? `0${min}` : min}:
              {sec < 10 ? `0${sec}` : sec}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
