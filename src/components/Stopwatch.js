import React, { useEffect, useState } from "react";
import "./Stopwatch.css";
import { Button } from "@mui/material";

const Stopwatch = ({value}) => {
  

  // Display logic integrated into the Stopwatch component
  const displayTime = (totalMilliseconds) => {
    const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

    return (
      <div>
        {days} days {hours} hours {minutes} minutes {seconds} seconds
      </div>
    );
  };

  return (
    <div className="stopwatch-container">
      {displayTime(value)}
      <div className="button-container">
        {isRunning? (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setIsRunning(false);
            }}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => {
              setIsRunning(true);
            }}
          >
            Start
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={() => {
            setValue(0);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
