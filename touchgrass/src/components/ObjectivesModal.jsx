import { useState, useEffect } from "react";
import "./ObjectivesModal.css";

export default function ObjectivesModal({ open, onClose }) {
  const [userStats, setUserStats] = useState({
    completedObjectives: []
  });

  // Load user stats to track completed objectives
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

  const objectives = [
    {
      id: "leaf",
      icon: "🍃",
      title: "Find a Leaf",
      description: "Photograph any tree or plant leaf",
      difficulty: "Easy",
      points: 10,
      tips: "Look for leaves with interesting shapes, colors, or textures. Close-up shots work best!"
    },
    {
      id: "grass",
      icon: "🌱",
      title: "Find Grass",
      description: "Capture ground cover or lawn grass",
      difficulty: "Easy", 
      points: 10,
      tips: "Focus on the texture and patterns of grass. Morning dew can add beautiful detail!"
    },
    {
      id: "monster",
      icon: "👹",
      title: "Find a Monster",
      description: "Creative interpretation welcome!",
      difficulty: "Hard",
      points: 25,
      tips: "Be creative! This could be an interesting tree shape, shadow, or natural formation that looks monster-like."
    }
  ];

  const isCompleted = (objectiveId) => {
    return userStats.completedObjectives?.includes(objectiveId) || false;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "#10b981";
      case "medium": return "#f59e0b";
      case "hard": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const completedCount = objectives.filter(obj => isCompleted(obj.id)).length;
  const totalPoints = objectives.reduce((sum, obj) => sum + (isCompleted(obj.id) ? obj.points : 0), 0);

  if (!open) return null;

  return (
    <div className="objectives-backdrop" onClick={onClose}>
      <div className="objectives-modal" onClick={(e) => e.stopPropagation()}>
        <div className="objectives-header">
          <h3>🎯 Current Objectives</h3>
          <button className="objectives-close" onClick={onClose} aria-label="Close">✖</button>
        </div>

        <div className="objectives-content">
          <div className="objectives-summary">
            <div className="summary-card">
              <span className="summary-icon">✅</span>
              <div className="summary-info">
                <span className="summary-value">{completedCount}/{objectives.length}</span>
                <span className="summary-label">Completed</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">⭐</span>
              <div className="summary-info">
                <span className="summary-value">{totalPoints}</span>
                <span className="summary-label">Points Earned</span>
              </div>
            </div>
          </div>

          <div className="objectives-list">
            {objectives.map((objective) => {
              const completed = isCompleted(objective.id);
              return (
                <div 
                  key={objective.id} 
                  className={`objective-card ${completed ? 'completed' : ''}`}
                >
                  <div className="objective-header">
                    <span className="objective-icon">{objective.icon}</span>
                    <div className="objective-title-section">
                      <h4 className="objective-title">{objective.title}</h4>
                      <div className="objective-meta">
                        <span 
                          className="difficulty-badge"
                          style={{ backgroundColor: getDifficultyColor(objective.difficulty) }}
                        >
                          {objective.difficulty}
                        </span>
                        <span className="points-badge">{objective.points} pts</span>
                      </div>
                    </div>
                    {completed && (
                      <div className="completion-badge">
                        <span className="completion-icon">✅</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="objective-description">{objective.description}</p>
                  
                  <div className="objective-tips">
                    <strong>💡 Tip:</strong> {objective.tips}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="objectives-footer">
            <div className="footer-info">
              <p>📸 Use the camera to capture these items and earn points!</p>
              <p>🏆 Complete all objectives to unlock special achievements!</p>
            </div>
          </div>
        </div>

        <div className="objectives-actions">
          <button className="objectives-btn" onClick={onClose}>
            Start Hunting! 🌿
          </button>
        </div>
      </div>
    </div>
  );
}