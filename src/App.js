import { useState } from 'react';
import './App.css';
import WebCamera from './components/Webcam';
import Welcome from './components/Welcome';
import WebCameraPolaroid from './components/WebcamPolaroid';
import WebCameraInstagram from './components/WebcamInstagram';

function App() {
  const [step, setStep] = useState('welcome');

  const handleStep = (step) => {
    setStep(step);
  }

  return (
    <div className="App">
      {step === 'welcome' && <Welcome handleStep={handleStep} />}
      {step === 'camera' && <WebCamera handleStep={handleStep} />}
      {step === 'polaroid' && <WebCameraPolaroid handleStep={handleStep} />}
      {step === 'instagram' && <WebCameraInstagram handleStep={handleStep} />}
    </div>
  );
}

export default App;
