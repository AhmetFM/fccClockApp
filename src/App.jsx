import { useEffect, useRef, useState } from "react";
import "./App.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [displayTime, setDisplayTime] = useState(1500);
  const [timerOn, setTimerOn] = useState(false);
  const [timerId, setTimerId] = useState("Session");
  const audioElement = useRef(null);
  let loop = undefined;

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }

  const changeTime = (amount, type) => {
    let newCount;
    if (type === "Session") {
      newCount = sessionTime + amount;
    } else {
      newCount = breakTime + amount;
    }

    if (newCount > 0 && newCount <= 60 && !timerOn) {
      type === "Session" ? setSessionTime(newCount) : setBreakTime(newCount);
      if (type === "Session") {
        setDisplayTime(newCount * 60);
      }
    }
  };

  const setActive = () => {
    setTimerOn(!timerOn);
  };

  useEffect(() => {
    if (timerOn && displayTime > 0) {
      const interval = setInterval(() => {
        setDisplayTime(displayTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (displayTime === 0) {
      audioElement.current.play();
      audioElement.current.currentTime = 0;

      //    setTimeout(() => {
      if (timerId === "Session") {
        setDisplayTime(breakTime * 60);
        setTimerId("Break");
      }
      if (timerId === "Break") {
        setDisplayTime(sessionTime * 60);
        setTimerId("Session");
      }
    }
  }, [breakTime, sessionTime, displayTime, timerId, timerOn]);

  const resetTime = () => {
    setBreakTime(5);
    setSessionTime(25);
    setDisplayTime(1500);
    setTimerId("Session");
    setTimerOn(false);
    clearInterval(loop);
    audioElement.current.load();
  };

  return (
    <>
      <div className="container">
        <div className="app">
          <div>
            <span id="label">25 + 5 Clock</span>
          </div>
          <div className="indicators">
            <div className="indicator">
              <span className="lengths" id="break-label">
                Break Length
              </span>
              <div className="button-container">
                <button
                  id="break-decrement"
                  onClick={() => {
                    changeTime(-1, "Break");
                  }}
                >
                  <ArrowDownwardIcon />
                </button>
                <span id="break-length">{breakTime}</span>
                <button
                  id="break-increment"
                  onClick={() => {
                    changeTime(1, "Break");
                  }}
                >
                  <ArrowUpwardIcon />
                </button>
              </div>
            </div>
            <div className="indicator">
              <span className="lengths" id="session-label">
                Session Length
              </span>
              <div className="button-container">
                <button
                  id="session-decrement"
                  onClick={() => {
                    changeTime(-1, "Session");
                  }}
                >
                  <ArrowDownwardIcon />
                </button>
                <span id="session-length">{sessionTime} </span>
                <button
                  id="session-increment"
                  onClick={() => changeTime(1, "Session")}
                >
                  <ArrowUpwardIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="time-container">
            <span id="timer-label">{timerId}</span>
            <span id="time-left"> {formatTime(displayTime)} </span>
          </div>
          <div className="bottom-buttons">
            <span id="start_stop" onClick={setActive}>
              {timerOn ? (
                <button>
                  <PauseIcon />
                </button>
              ) : (
                <button>
                  <PlayArrowIcon />
                </button>
              )}
            </span>
            <button id="reset" onClick={resetTime}>
              <RestartAltIcon />
            </button>
            <audio
              id="beep"
              type="audio/mpeg"
              src="./Alarm.mp3"
              ref={audioElement}
            />
          </div>
          <div>
            <span className="footer">
              Coded by <a href="">Ahmet Furkan Meric</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
