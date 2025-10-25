import { useState } from "react";
import "./App.css";
import Camera from "./Camera";

function App() {
  const [started, setStarted] = useState(false);

  const handleStart = () => setStarted(true);

  return (
    <div className="App">
      {!started ? (
        <div className="welcome-screen">
          <h1 className="welcome-title">🌿 Welcome to TouchGrass!</h1>
          <p className="welcome-text">
            TouchGrass helps you reconnect with nature by identifying the plants, trees,
            and natural environments around you using your device's camera.
          </p>
          <button className="start-btn" onClick={handleStart}>
            Start Exploring 🌎
          </button>
        </div>
      ) : (
        <Camera />
      )}
    </div>
  );
}

export default App;
