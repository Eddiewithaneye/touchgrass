import { useState, useRef, useEffect } from "react";
import "./MenuDropdown.css";

export default function MenuDropdown({ 
  isOpen, 
  onClose, 
  onLeaderboardClick,
  onObjectivesClick,
  onProfileClick,
  onHelpClick 
}) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: "🏆",
      label: "Leaderboard",
      description: "View top explorers",
      onClick: onLeaderboardClick
    },
    {
      icon: "🎯",
      label: "Objectives",
      description: "Current challenges",
      onClick: onObjectivesClick
    },
    {
      icon: "👤",
      label: "Profile",
      description: "Your stats & progress",
      onClick: onProfileClick
    },
    {
      icon: "❓",
      label: "Help",
      description: "Instructions & tips",
      onClick: onHelpClick
    }
  ];

  return (
    <div className="menu-dropdown" ref={dropdownRef}>
      <div className="menu-header">
        <h3>🌿 TouchGrass Menu</h3>
      </div>
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="menu-item"
            onClick={() => {
              item.onClick();
              onClose();
            }}
            aria-label={item.label}
          >
            <span className="menu-icon">{item.icon}</span>
            <div className="menu-content">
              <span className="menu-label">{item.label}</span>
              <span className="menu-description">{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}