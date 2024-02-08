import { setTimerFinished } from '@root/apis/onboarding/authenticationSlice'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

const CountdownTimer = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const dispatch = useDispatch()

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1)
      } else {
        clearInterval(intervalId)
        dispatch(setTimerFinished(true))
      }
    }, 1000)

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [seconds])

  // Format seconds into minutes and seconds
  const formattedTime = `${Math.floor(seconds / 60)}:${(
    seconds % 60
  ).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`

  return (
    <div className="m-0">
      <p style={{ color: '#6bc909', margin: '0px' }}>{formattedTime}</p>
    </div>
  )
}

export default CountdownTimer
