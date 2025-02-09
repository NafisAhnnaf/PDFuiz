import React, { useState, useEffect } from 'react';

const TimerProgressBar = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If there's no time left, stop the interval
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Decrease every second

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [timeLeft]);

  // Calculate progress percentage
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
