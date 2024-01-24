import Webcam from "react-webcam";
import React, { useState, useRef, useCallback } from "react";

function Welcome(props) {
  // listen to key right arrow press
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      props.handleStep('camera');
    }
    if (event.key === 'ArrowLeft') {
      props.handleStep('polaroid');
    }
    if (event.key === 'ArrowUp') {
      props.handleStep('instagram');
    }
  }

  // add event listener to the document
  document.addEventListener("keydown", handleKeyDown, false);

  return (
    <div className="App">
      <button onClick={() => props.handleStep('camera')}>Start</button>
    </div>
  );
}

export default Welcome;
