import { useState, useRef } from "react";
import "./Header.css";
import MenuDropdown from "./MenuDropdown";

export default function Header({
  user,
  onLoginClick,
  onLogoutClick,
  onLogoClick,
  onLeaderboardClick,
  onObjectivesClick,
  onProfileClick,
  onHelpClick,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((v) => !v);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const displayName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Explorer";

  return (
    <header className="header">
      <div className="inner">
        <div className="left">
          <h1 className="logo" onClick={onLogoClick} style={{ cursor: "pointer" }}>
            🌿TouchGrass!
          </h1>
        </div>

        <div className="right">
          {user ? (
            <div className="user-area">
              <span className="welcome">👋 Hi, {displayName}!</span>
              {onLogoutClick && (
                <button className="logout-btn" onClick={onLogoutClick}>
                  Log out
                </button>
              )}
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-btn">
              Log In
            </button>
          )}

          <div className="menu-container" style={{ position: "relative" }}>
            <button
              ref={menuBtnRef}
              className={`menu ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
              type="button"
            >
              Menu {isMenuOpen ? "▲" : "▼"}
            </button>

            <MenuDropdown
              isOpen={isMenuOpen}
              onClose={closeMenu}
              anchorRef={menuBtnRef}              /* <-- pass the button ref */
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
