import { useState, useEffect } from "react";
import "./UserProfile.css";

export default function UserProfile({ open, onClose }) {
  const [userStats, setUserStats] = useState({
    displayName: "Explorer",
    photosTaken: 0,
    successfulMatches: 0,
    currentStreak: 0,
    bestStreak: 0,
    rank: 0,
    joinDate: new Date().toLocaleDateString()
  });

  // Load user stats from localStorage
  useEffect(() => {
    if (!open) return;

    try {
      const savedStats = localStorage.getItem("tg.userStats");
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        setUserStats(prev => ({ ...prev, ...stats }));
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  }, [open]);

  // Calculate success rate
  const successRate = userStats.photosTaken > 0 
    ? Math.round((userStats.successfulMatches / userStats.photosTaken) * 100)
    : 0;

  // Get achievement badges
  const getAchievements = () => {
    const achievements = [];
    
    if (userStats.successfulMatches >= 1) achievements.push({ icon: "🌱", name: "First Success", desc: "First successful match" });
    if (userStats.successfulMatches >= 5) achievements.push({ icon: "🌿", name: "Nature Explorer", desc: "5 successful matches" });
    if (userStats.successfulMatches >= 10) achievements.push({ icon: "🌳", name: "Tree Hugger", desc: "10 successful matches" });
    if (userStats.currentStreak >= 3) achievements.push({ icon: "🔥", name: "On Fire", desc: "3+ match streak" });
    if (successRate >= 80 && userStats.photosTaken >= 5) achievements.push({ icon: "🎯", name: "Sharp Eye", desc: "80%+ success rate" });
    
    return achievements;
  };

  const achievements = getAchievements();

  if (!open) return null;

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h3>👤 Your Profile</h3>
          <button className="profile-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-avatar">🌿</div>
            <h4 className="profile-name">{userStats.displayName}</h4>
            <p className="profile-join-date">Exploring since {userStats.joinDate}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📸</span>
              <span className="stat-value">{userStats.photosTaken}</span>
              <span className="stat-label">Photos Taken</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <span className="stat-value">{userStats.successfulMatches}</span>
              <span className="stat-label">Successful Matches</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{userStats.currentStreak}</span>
              <span className="stat-label">Current Streak</span>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="achievements-section">
              <h5>🏆 Achievements</h5>
              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-badge">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-info">
                      <span className="achievement-name">{achievement.name}</span>
                      <span className="achievement-desc">{achievement.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="profile-actions">
            <button 
              className="profile-btn secondary"
              onClick={() => {
                const newName = prompt("Enter your display name:", userStats.displayName);
                if (newName && newName.trim()) {
                  const updatedStats = { ...userStats, displayName: newName.trim() };
                  setUserStats(updatedStats);
                  localStorage.setItem("tg.userStats", JSON.stringify(updatedStats));
                }
              }}
            >
              Change Name
            </button>
            <button 
              className="profile-btn primary"
              onClick={onClose}
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}