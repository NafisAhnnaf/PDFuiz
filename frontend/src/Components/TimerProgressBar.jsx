import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TimerProgressBar = ({ duration, navigator }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Start the countdown timer when the component mounts
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(`/${navigator}`);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          navigate(`/${navigator}`);  // Navigate when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrease every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timeLeft, navigator, navigate]); // Added necessary dependencies

  // Update the progress bar based on timeLeft
  useEffect(() => {
    setProgress(((duration - timeLeft) / duration) * 100);
  }, [timeLeft, duration]);

  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="text-center text-sm mt-2">
        {timeLeft}s Remaining
      </div>
    </div>
  );
};

export default TimerProgressBar;
