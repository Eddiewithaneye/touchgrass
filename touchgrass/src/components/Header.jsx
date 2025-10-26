import { useState } from "react";
import "./Header.css";
import MenuDropdown from "./MenuDropdown";

export default function Header({
  onLoginClick,
  onLogoClick,
  onLeaderboardClick,
  onObjectivesClick,
  onProfileClick,
  onHelpClick
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="inner">
        <div className="left">
          <h1 className="logo" onClick={onLogoClick} style={{ cursor: "pointer" }}>
            🌿TouchGrass!
          </h1>
        </div>
        <div className="right">
          <button onClick={onLoginClick} className="login-btn">
            Log In
          </button>
          <div className="menu-container">
            <button
              className={`menu ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              Menu {isMenuOpen ? '▲' : '▼'}
            </button>
            <MenuDropdown
              isOpen={isMenuOpen}
              onClose={closeMenu}
              onLeaderboardClick={onLeaderboardClick}
              onObjectivesClick={onObjectivesClick}
              onProfileClick={onProfileClick}
              onHelpClick={onHelpClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
}