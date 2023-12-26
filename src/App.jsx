import { useState, useEffect, useRef } from 'react';
import './App.css';

function PomodoroApp() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [minutes, setMinutes] = useState(sessionLength);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isWork, setIsWork] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer is up, switch to break or work
            setIsBreak(!isBreak);
            setMinutes(isBreak ? sessionLength : breakLength);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);

      if (minutes === 0 && seconds === 0) {
        audioRef.current.play();
      }
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, sessionLength, breakLength]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsWork(true);
  };

  const resetTimer = () => {
    setIsWork(false);
    setIsActive(false);
    setIsBreak(false);

    setMinutes(25);
    setSeconds(0);
    //
    setSessionLength(25);
    setBreakLength(5);
    //
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const increaseSessionLength = () => {
    if (!isActive && !isWork && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setMinutes(sessionLength + 1);
    }
  };

  const decreaseSessionLength = () => {
    if (!isActive && !isWork && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setMinutes(sessionLength - 1);
    }
  };

  const increaseBreakLength = () => {
    if (!isActive && !isWork && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decreaseBreakLength = () => {
    if (!isActive && !isWork && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  return (
    <div className='pomodoro-app'>
      <h1 id='timer-label'>{isBreak ? 'Break' : 'Work'}</h1>
      <div id='time-left'>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className='controls'>
        <button onClick={toggleTimer} id='start_stop'>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} id='reset'>
          Reset
        </button>
      </div>
      <div className='length-controls'>
        <div className='session'>
          <p id='session-label'>Session Length</p>
          <button onClick={increaseSessionLength} id='session-increment'>
            +
          </button>
          <span id='session-length'>{sessionLength}</span>
          <button onClick={decreaseSessionLength} id='session-decrement'>
            -
          </button>
        </div>
        <div className='break'>
          <p id='break-label'>Break Length</p>
          <button onClick={increaseBreakLength} id='break-increment'>
            +
          </button>
          <span id='break-length'>{breakLength}</span>
          <button onClick={decreaseBreakLength} id='break-decrement'>
            -
          </button>
        </div>
      </div>
      <audio
        src='https://www.soundjay.com/misc/sounds/pill-bottle-2.mp3'
        id='beep'
        ref={audioRef}
      />
    </div>
  );
}

export default PomodoroApp;
