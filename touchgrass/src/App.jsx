import { useState, useEffect } from "react";
import "./App.css";
import Camera from "./Camera";
import Header from "./components/Header";
import Login from "./components/Login";
import ObjectivesModal from "./components/ObjectivesModal";
import HelpModal from "./components/HelpModal";
import UserProfile from "./components/UserProfile";

export default function App() {
  const [started, setStarted] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const [user, setUser] = useState(null);
  
  // Modal states
  const [showObjectives, setShowObjectives] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Load existing user on mount (from localStorage)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tg.userStats") || "null");
    if (stored?.displayName || stored?.email) {
      setUser(stored);
    }
  }, []);

  // Navigation helpers
  const goHome = () => {
    setStarted(false);
    setLoginPage(false);
  };
  const openLogin = () => {
    setStarted(false);
    setLoginPage(true);
  };

  // Logout clears storage + state and goes home
  const onLogoutClick = () => {
    localStorage.removeItem("tg.userStats");
    setUser(null);
    goHome();
  };

  // Modal handlers
  const handleLeaderboardClick = () => {
    // For now, just show help since LeaderboardModal is empty
    setShowHelp(true);
  };

  const handleObjectivesClick = () => {
    setShowObjectives(true);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  return (
    <div className="App">
      <main>
        {/* Header is always visible */}
        <Header
          user={user}
          onLoginClick={openLogin}
          onLogoutClick={onLogoutClick}
          onLogoClick={goHome}
          onLeaderboardClick={handleLeaderboardClick}
          onObjectivesClick={handleObjectivesClick}
          onProfileClick={handleProfileClick}
          onHelpClick={handleHelpClick}
        />

        {/* Main view switch */}
        {started ? (
          <Camera />
        ) : loginPage ? (
          <Login
            onClose={(newUser) => {
              if (newUser) setUser(newUser); // update header to "signed in"
              goHome();                       // return to welcome
            }}
          />
        ) : (
          // Welcome screen
          <div className="welcome-screen">
            <div className="container">
              <div className="welcome-content">
                <h1 className="welcome-title">🌿 Welcome to TouchGrass!</h1>
                <p className="welcome-text">
                  TouchGrass helps you reconnect with nature by identifying the plants, trees,
                  and natural environments around you using your device's camera.
                </p>
                <button className="start-btn" onClick={() => setStarted(true)}>
                  Start Exploring 🌎
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ObjectivesModal
        open={showObjectives}
        onClose={() => setShowObjectives(false)}
      />
      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />
      <UserProfile
        open={showProfile}
        onClose={() => setShowProfile(false)}
        onUserUpdate={setUser}
      />
    </div>
  );
}
