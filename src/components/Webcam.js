import Webcam from "react-webcam";
import React, { useState, useRef, useCallback, useEffect } from "react";

function WebCamera(props) {
  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [captureInProgress, setCaptureInProgress] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [viewCountdown, setViewCountdown] = useState(false);
  const [viewPhotoTaken, setViewPhotoTaken] = useState(false);

  const saveAs = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "image.jpg";
    link.click();
  }

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  const capture = useCallback(() => {
    if (!captureInProgress) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    setPhotoCount(prevCount => prevCount + 1);

    // Convert base64 image to blob
    setPhotos(prevPhotos => [...prevPhotos, dataURItoBlob(imageSrc)]);

  }, [webcamRef, photos, photoCount]);


  useEffect(() => {
    if (photoCount === 3) {
      setCaptureInProgress(false);
      sendPhotosToBackend(photos);
    }
  }, [photoCount, photos]);

  const sendPhotosToBackend = async () => {
    try {
      const formData = new FormData();

      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      if (photos.length === 0) {
        return;
      }

      const response = await fetch('http://localhost:3001/api/collage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('URL del collage:', data.collageUrl);
      } else {
        console.error('Error al enviar las fotos al backend');
      }
      props.handleStep('welcome');
    } catch (error) {
      console.error('Error en la llamada al backend:', error);
    }
  };

  const handleCaptureStart = async () => {
    console.log('Capture started, preparing to capture 3 photos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    for (let i = 0; i < 3; i++) {
      setViewCountdown(true);
      for (let i = 3; i >= 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      capture(); // Wait for capture to complete before moving to the next iteration
      setViewCountdown(false);
      setViewPhotoTaken(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      setCountdown(3);
      setViewPhotoTaken(false);
    }

    console.log('Capture completed for 3 photos.');
    sendPhotosToBackend();
  }

  useEffect(() => {
    handleCaptureStart();
  }, []);


  const FlashEffect = ({ visible }) => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "white",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 1,
      }}
    />
  );

  return (
    <div className="WebcamContainer" style={{ position: "relative", width: "80%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute" }}>
        <Webcam mirrored={true} screenshotFormat="image/jpeg" ref={webcamRef} style={{ width: "100%", height: "100%" }} />
        {/* <button onClick={capture}>Capture photo</button>
      <img src={img} alt="screenshot" /> */}
        {viewCountdown && <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "100px", color: "white" }}>{countdown}</div>}
        <FlashEffect visible={viewPhotoTaken} />
      </div>
    </div>
  );
}

export default WebCamera;
