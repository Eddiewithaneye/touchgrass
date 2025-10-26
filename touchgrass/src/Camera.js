import { useState, useRef, useEffect } from "react";   // 👉 NEW: useEffect for tiny cleanup
import "./Camera.css";

function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [objComplete, setObjComplete] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [pressedSend, setPressedSend] = useState(false);
  const objectives = {
    "leaf": {
      text: "find a leaf",
      description: "Leaf, as in the plant"
    },
    "grass": {
      text: "find grass",
      description: "grass, as in the plant"
    },
    "monster": {
      text: "find a monster",
      description: "A monster. Any kind of monster, including the energy drink, dragons, or any other kind of monsterish creature"
    },
    "human": {
      text: "find a human",
      description: "A Human. " 
    },
    "tk": {
      "text": "find tk",
      description: "TK is one of the UCF Knight hacks mascots. He is a funko pop-like figurine who looks like a blue and grey knight. He has a helmet and grey armor."
    }
  };

  // Get random key
  const keys = Object.keys(objectives);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const [currentObjective, setCurrentObjective] = useState(objectives[randomKey]);


  // 👉 NEW: tiny helper to detect a "match" from backend
  const isMatch = (result) => {
    if (!result) return false;
    // support either an explicit boolean or a message string like "yes"
    if (typeof result.match === "boolean") return result.match;
    const msg = (result.message || "").toLowerCase();
    return msg.includes("yes") || msg.includes("match") || msg.includes("great job");
  };

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

  // 👉 NEW: stop any active tracks (lightweight; doesn’t change your flow)
  const stopCamera = () => {
    const video = videoRef.current;
    const stream = video && video.srcObject;
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (video) video.srcObject = null;
  };

  // 👉 NEW: ensure camera releases when component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

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
    if (pressedSend) return alert("Already pressed send!");
    setPressedSend(true);

    if (!capturedImage) return alert("No image captured yet!");

    try {
      const imageBlob = dataURLtoBlob(capturedImage);
      const formData = new FormData();
      formData.append("file", imageBlob, "photo.png");
      formData.append("description", JSON.stringify(currentObjective.description))

      // ⚠️ Update this URL when your backend is ready
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const success = isMatch(result);
      setResultMessage(result.message || "Result received!");

      // Emit photo submission event for stats tracking
      window.dispatchEvent(new CustomEvent("tg-photo-submitted", {
        detail: { success }
      }));

      // 👉 NEW: if the submission matches the prompt, open Leaderboard
      if (success) {
        // Update user stats and show success message
        setResultMessage("🎉 Great match! " + (result.message || "Well done!"));
        
        // fire a global event your Header/App can listen to
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("tg-open-leaderboard"));
        }, 1500); // Delay to show success message first
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setResultMessage("Error sending image. Try again!");
      
      // Still emit event for failed attempt
      window.dispatchEvent(new CustomEvent("tg-photo-submitted", {
        detail: { success: false }
      }));
    } finally {
      // 👉 NEW: let user press Send again after another capture
      setPressedSend(false);
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
            />
            <div className="camera-buttons">
              <button className="retake" onClick={retakePhoto}>
                🔁 Retake
              </button>
              <button className="send" onClick={sendToAPI}>
                🚀 Send to API
              </button>
            </div>
          </div>
        )}
      </div>
        <p className = "objective">{currentObjective["text"]}</p>
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
          <div className="result-message">{resultMessage}</div>
        )}
      </div>
    </div>
  );
}

export default Camera;
