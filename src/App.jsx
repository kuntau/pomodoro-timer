import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [ breakLength, setBreakLength ] = useState(5)
  const [ sessionLength, setSessionLength ] = useState(25) // in minutes
  const [ timer, setTimer ] = useState(sessionLength) // in seconds
  const [ timerDisplay, setTimerDisplay ] = useState(0)
  const [ sessionCountdown, setSessionCountdown ] = useState(false)
  const [ breakCountdown, setBreakCountdown ] = useState(false)
  const [ play, setPlay ] = useState(false)
  const [ debug, setDebug ] = useState(true)
  const [ intervalId, setIntervalId ] = useState(null)
  const [ timerLabel, setTimerLable ] = useState("Session")
  const [ sessionTimerId, setSessionTimerId ] = useState(null)
  const [ breakTimerId, setBreakTimerId ] = useState(null)
  let audioBeep = null

  const convertTimer = (time) => time*60
  const formatTimerForDiplay = (time) => `${Math.floor(time/60)}:${String(time%60).padStart(2,'0')}`
  // const formatTimerForDiplay = (time) => `${time}:00`

  // const setLength = (type, op) => {
  //   switch (type) {
  //     case "session":
  //       switch (op) {
  //         case "increment":
  //           setSessionLength(sessionLength => sessionLength + 1)
  //           break
  //         case "decrement":
  //           setSessionLength(sessionLength => sessionLength - 1)
  //           break
  //       }
  //     case "break":
  //       switch (op) {
  //         case "increment":
  //           setBreakLength(breakLength => {
  //             if (breakLength >= 0 && breakLength <= 60) {  breakLength+1 }
  //
  //           })
  //       }
  //   }
  //   // if (type == "session") {
  //   //   setSessionLength(sessionLength => sessionLength + 1)
  //   // } else if (type == "break") {
  //   //   if (op )
  // }

  const createTimer = (event) => {
    const ID = setInterval(reduceTimer, 1000)
    setIntervalId(ID)
    console.log("createTimer", event)
  }

  const clearTimer = (id = intervalId) => {
    if (id) {
      clearInterval(id)
      console.log("clearTimer", id)
    }
  }

  const reduceTimer = () => setTimer(timer => timer - 1)

  const reset = () => {
    clearTimer()
    audioBeep.pause()
    setSessionCountdown(false)
    setBreakCountdown(false)
    setIntervalId(null)
    setPlay(false)
    setBreakLength(5)
    setSessionLength(25)
    setTimer(convertTimer(25))
  }

  useEffect(() => {
    if (timer > 0) {
      setTimerDisplay(formatTimerForDiplay(timer))
    } else if (timer == 0) {
      console.log("play beep")
      setTimerDisplay(formatTimerForDiplay(timer))
      audioBeep.play()
      // clearInterval(intervalId)
      if (sessionCountdown) { setTimer(sessionLength) }
      else { setTimer(breakLength) }
      setSessionCountdown(!sessionCountdown)
      setBreakCountdown(!breakCountdown)
    } else {
      clearInterval(intervalId)
      // setIntervalId(null)
      console.log("timer_watcher: fatal error", timer)
    }
  }, [timer])

  useEffect(() => {
    setTimer(convertTimer(sessionLength))
  }, [sessionLength])

  useEffect(() => {
    console.log("play watcher", play?'play':'pause')
    if (play && timer > 0) {
      if (!sessionCountdown && !breakCountdown) {
        setSessionCountdown(true)
      } else if (sessionCountdown || breakCountdown) {
        console.log("play pause resume")
        const ID = setInterval(reduceTimer, 100)
        setIntervalId(ID)
      }
    } else if (!play) {
      console.log("play watcher else")
      clearInterval(intervalId)
    }
    // const intervalId = setInterval(modifyTimer, 1000)
    return () => clearInterval(intervalId)
  }, [play])

  // useEffect(() => setSessionCountdown(true),[])
  useEffect(() => {
    console.log("session watcher")
    if (sessionCountdown) { setTimer(convertTimer(sessionLength)); createTimer() }
    else { clearTimer(intervalId) }
  }, [sessionCountdown])

  useEffect(() => {
    console.log("break watcher")
    if (breakCountdown) { setTimer(convertTimer(breakLength)); createTimer() }
    else { clearTimer(intervalId) }
  }, [breakCountdown])

  return (
    <div className="App">
      <main id="clock" className="App-header flex flex-col w-screen">
        <h1 className="text-5xl"><i className="fas fa-stopwatch"></i> Tomato clock?</h1>
        <Settings breakLength={breakLength} sessionLength={sessionLength} setBreakLength={setBreakLength} setSessionLength={setSessionLength} />
        <div id="timer" className="bg-gradient-to-b from-gray-500 to-gray-700 p-10 border border-gray-800 rounded-full mt-5 h-80 w-80 flex flex-col justify-center shadow-lg">
          <h3 id="timer-label">{ timerLabel }</h3>
          <h2 id="time-left" className="text-8xl">{timerDisplay}</h2>
          <div className="flex justify-center">
            <button
              id="start_stop"
              className="mr-5"
              onClick={ () => {
                // handleStartStop(true)
                setPlay(!play)
                // handleStartStop(play)
                }
              }
            >
              <i className={`fas ${!play?'fa-play':'fa-pause'}`}></i>
            </button>
            <button
              id="reset"
              className="ml-5"
              onClick={ () => reset() }
            >
            <i className="fas fa-redo"></i>
            </button>
            {/* <button><i className="fas fa-hourglass"></i></button> */}
          </div>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
        <button className="mt-5 text-base" onClick={()=>setDebug(debug => !debug)}>DEBUG</button>
        { debug?
        <div id="debug" className="text-base">
          <ul>
            <li>{ play?'play':'pause' }</li>
            <li>Timer: {timer}</li>
            <li>Interval ID: {intervalId}</li>
            <li>Countdown: Session: { sessionCountdown?'ON':'OFF' } Break: { breakCountdown?'ON':'OFF' }</li>
          </ul>
        </div>
        :null }
      </main>
    </div>
  )
}

const Settings = ({breakLength, setBreakLength, sessionLength, setSessionLength}) => (
  <div id="settings" className="flex mt-10">
    <div className="bg-gradient-to-b from-blue-500 to-blue-700 flex justify-center px-8 py-2 w-1/2 rounded-l-full shadow-lg">
      <fieldset>
        <label htmlFor="break-length" id="break-label">
          Break length
        </label>
        <div className="flex items-center">
          <div className="flex-grow"><h3 id="break-length">{ breakLength }</h3></div>
          <div className="button-wrapper">
            <button
              id="break-increment"
              className="setting-button"
              onClick={ () => {
                if (breakLength >= 0 && breakLength < 60)  {
                  setBreakLength(breakLength => breakLength+1)
                }
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              id="break-decrement"
              className="setting-button"
              onClick={ () => {
                if (breakLength > 0 && breakLength <= 60)  {
                  setBreakLength(breakLength => breakLength-1)
                }
              }}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
    <div className="bg-gradient-to-b from-indigo-500 to-indigo-700 flex justify-center px-8 py-2 w-1/2 rounded-r-full shadow-lg">
      <fieldset>
        <label htmlFor="session-length" id="session-label" className="whitespace-nowrap">
          {/* Session&nbsp;length */}
          Session length
        </label>
        <div className="flex items-center">
          <div className="flex-grow"><h3 id="session-length">{ sessionLength }</h3></div>
          <div className="button-wrapper">
            <button
              id="session-increment"
              className="setting-button"
              onClick={ () => {
                if (sessionLength >= 0 && sessionLength < 60)  {
                  setSessionLength(sessionLength => sessionLength+1)
                }
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              id="session-decrement"
              className="setting-button"
              onClick={ () => {
                if (sessionLength > 0 && sessionLength <= 60)  {
                  setSessionLength(sessionLength => sessionLength-1)
                }
              }}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
);

export default App
