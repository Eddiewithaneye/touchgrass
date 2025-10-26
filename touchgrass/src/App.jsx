import { useState } from "react";
import "./App.css";
import Camera from "./Camera";
import Header from "./components/Header";
import Login from "./components/Login";

function App() {
  const [started, setStarted] = useState(false);
  const [loginPage, setLoginPage] = useState(false);

  const goHome = () => {
    setStarted(false);
    setLoginPage(false);
  };
  const openLogin = () => {
    setStarted(false);
    setLoginPage(true);
  };

  return (
    <div className="App">
      <main>
        {/* Header always visible so the logo is clickable everywhere */}
        <Header onLoginClick={openLogin} onLogoClick={goHome} />

        {!started ? (
          loginPage ? (
            <Login onClose={goHome} />
          ) : (
            <div className="welcome-screen">
              <div className="container">
                <div className="welcome-content">
                  <h1 className="welcome-title">🌿 Welcome to TouchGrass!</h1>
                  <p className="welcome-text">
                    TouchGrass helps you reconnect with nature by identifying
                    the plants, trees, and natural environments around you using
                    your device's camera.
                  </p>
                  <button className="start-btn" onClick={() => setStarted(true)}>
                    Start Exploring 🌎
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <Camera />
        )}
      </main>
    </div>
  );
}

export default App;
