import { useState } from "react";
import "./App.css";
import Camera from "./Camera";
import Header from "./components/Header";
import Login from "./components/Login";

function App() {
  const [started, setStarted] = useState(false);
  const [loginPage, setLoginPage] =  useState(false);

  const handleStart = () => setStarted(true);

  return (
    <div className="App">
      {!started ? (
        <main>
          <Header onLoginClick={() => setLoginPage(true)}/>
          {loginPage ? (
            <Login onClose={() => setLoginPage(false)} />
          ) : (
          <div className="welcome-screen">
            <div className = "container">
              <div className = "welcome-content">
                <h1 className="welcome-title">🌿 Welcome to TouchGrass!</h1>
                <p className="welcome-text">
                  TouchGrass helps you reconnect with nature by identifying the plants, trees,
                  and natural environments around you using your device's camera.
                </p>
                <button className="start-btn" onClick={handleStart}>
                  Start Exploring 🌎
                </button>
              </div>
            </div>
          </div>
          )}
        </main>
      ) : (
        <Camera />
      )}
    </div>

    
  );
}

export default App;
