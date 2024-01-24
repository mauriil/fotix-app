import Webcam from "react-webcam";
import React, { useState, useRef, useCallback, useEffect } from "react";

function WebCameraInstagram(props) {
  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [viewCountdown, setViewCountdown] = useState(false);


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
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    // Convert base64 image to blob
    setPhotos(prevPhotos => [...prevPhotos, dataURItoBlob(imageSrc)]);

  }, [webcamRef, photos]);

  useEffect(() => {
    sendPhotosToBackend(photos);
  }, [photos]);

  const sendPhotosToBackend = async () => {
    try {
      const formData = new FormData();

      photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      if (photos.length === 0) {
        return;
      }

      const response = await fetch('http://localhost:3001/api/instagram', {
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Capture started, preparing to capture photo..');
    setViewCountdown(true);

    for (let i = 3; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(i);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    capture(); // Wait for capture to complete before moving to the next iteration

    console.log('Capture completed.');
  }

  useEffect(() => {
    handleCaptureStart();
  }, []);

  return (
    <div className="WebcamContainer" style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute" }}>
        <Webcam mirrored={true} screenshotFormat="image/jpeg" ref={webcamRef} />
        {/* <button onClick={capture}>Capture photo</button>
      <img src={img} alt="screenshot" /> */}
               {viewCountdown && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "10rem", color: "white" }}>{countdown}</div>}
      </div>
    </div>
  );
}

export default WebCameraInstagram;
