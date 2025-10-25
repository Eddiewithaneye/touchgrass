import { useState, useRef } from "react";
import Header from "./components/Header.jsx"
import "./Camera.css";
import Objectives from "./components/Objectives";


function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [pressedSend, setPressedSend] = useState(false);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setShowCamera(true);
      setResultMessage("");

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

  // Capture a still image from the video
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    console.log("Photo captured!");
  };

  // Convert Base64 image to Blob for upload
  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Send image to backend for recognition
  const sendToAPI = async () => {
    if (pressedSend) return alert ("Already pressed send!");
    setPressedSend(true);
    if (!capturedImage) return alert("No image captured yet!");

    try {
      const imageBlob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append("file", imageBlob, "photo.png");

      // ⚠️ Update this URL when Tarun's backend is ready
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setResultMessage(result.message || "Result received!");
    } catch (error) {
      console.error("Upload failed:", error);
      setResultMessage("Error sending image. Try again!");
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCamera(true);
    setResultMessage("");
  };

return (
  <div className="camera-container">
    {/* TaskBar sits at the top of the viewport */}
    <Header />
    <div className="camera-screen">
      <div className="camera-card">
        <h2>So you found something? Prove it!</h2>

        {!showCamera && !capturedImage && (
          <button className="start" onClick={startCamera}>
            Start Camera
          </button>
        )}

        {showCamera && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="400"
              height="300"
            />
            <br />
            <button className="capture" onClick={capturePhoto}>
              📸 Capture Photo
            </button>
            
          </div>
        )}
      </div>
      {showCamera ? <Objectives showCamera={showCamera} /> : null}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {capturedImage && (
        <div>
          <h3>Preview</h3>
          <img
            src={capturedImage}
            alt="Captured"
            width="400"
            height="300"
          />
          <br />
          <button className="retake" onClick={retakePhoto}>
            🔁 Retake
          </button>
          <button className="send" onClick={sendToAPI}>
            🚀 Send to API
          </button>
        </div>
      )}

      {resultMessage && (
        <h2 className="result-message">{resultMessage}</h2>
      )}
    </div>
  </div>
);
}

export default Camera;
