import { useState, useEffect } from "react";
import "./App.css";
import "./mobile.css";
import Camera from "./Camera";
import Header from "./components/Header";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import UserProfile from "./components/UserProfile";
import HelpModal from "./components/HelpModal";
import ObjectivesModal from "./components/ObjectivesModal";

function App() {
  const [started, setStarted] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  
  // Modal states
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);

  const goHome = () => {
    setStarted(false);
    setLoginPage(false);
  };

  const openLogin = () => {
    setStarted(false);
    setLoginPage(true);
  };

  // Modal handlers
  const openLeaderboard = () => setShowLeaderboard(true);
  const closeLeaderboard = () => setShowLeaderboard(false);
  
  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);
  
  const openHelp = () => setShowHelp(true);
  const closeHelp = () => setShowHelp(false);
  
  const openObjectives = () => setShowObjectives(true);
  const closeObjectives = () => setShowObjectives(false);

  // Listen for successful photo submission to trigger leaderboard
  useEffect(() => {
    const handleOpenLeaderboard = () => {
      setShowLeaderboard(true);
    };

    window.addEventListener("tg-open-leaderboard", handleOpenLeaderboard);
    
    return () => {
      window.removeEventListener("tg-open-leaderboard", handleOpenLeaderboard);
    };
  }, []);

  // Update user stats when successful match occurs
  const updateUserStats = (isSuccess = false) => {
    try {
      const currentStats = JSON.parse(localStorage.getItem("tg.userStats") || "{}");
      const updatedStats = {
        displayName: currentStats.displayName || "Explorer",
        photosTaken: (currentStats.photosTaken || 0) + 1,
        successfulMatches: currentStats.successfulMatches || 0,
        currentStreak: currentStats.currentStreak || 0,
        bestStreak: currentStats.bestStreak || 0,
        completedObjectives: currentStats.completedObjectives || [],
        joinDate: currentStats.joinDate || new Date().toLocaleDateString()
      };

      if (isSuccess) {
        updatedStats.successfulMatches += 1;
        updatedStats.currentStreak += 1;
        updatedStats.bestStreak = Math.max(updatedStats.bestStreak, updatedStats.currentStreak);
      } else {
        updatedStats.currentStreak = 0;
      }

      localStorage.setItem("tg.userStats", JSON.stringify(updatedStats));
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  };

  // Listen for photo submissions to update stats
  useEffect(() => {
    const handlePhotoSubmission = (event) => {
      const isSuccess = event.detail?.success || false;
      updateUserStats(isSuccess);
    };

    window.addEventListener("tg-photo-submitted", handlePhotoSubmission);
    
    return () => {
      window.removeEventListener("tg-photo-submitted", handlePhotoSubmission);
    };
  }, []);

  return (
    <div className="App">
      <main>
        {/* Header always visible so the logo is clickable everywhere */}
        <Header
          onLoginClick={openLogin}
          onLogoClick={goHome}
          onLeaderboardClick={openLeaderboard}
          onObjectivesClick={openObjectives}
          onProfileClick={openProfile}
          onHelpClick={openHelp}
        />

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

        {/* Modals */}
        <Leaderboard
          open={showLeaderboard}
          onClose={closeLeaderboard}
        />
        <UserProfile
          open={showProfile}
          onClose={closeProfile}
        />
        <HelpModal
          open={showHelp}
          onClose={closeHelp}
        />
        <ObjectivesModal
          open={showObjectives}
          onClose={closeObjectives}
        />
      </main>
    </div>
  );
}

export default App;
