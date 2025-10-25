import { useState, useRef } from 'react';

function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }
    });
    
    setShowCamera(true); // Show video FIRST
    
    // Wait a tiny bit for video element to appear
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Camera started!");
      }
    }, 100);
    
  } catch (error) {
    alert("Could not access camera: " + error.message);
  }
};

  return (
    <div>
      <h2>TouchGrass Camera</h2>
      <button onClick={startCamera}>Take Photo</button>
      
      {showCamera && (
        <video 
          ref={videoRef} 
          autoPlay 
          width="400" 
          height="300"
        />
      )}
    </div>
  );
}

export default Camera;