import { useRef, useEffect } from "react";
import "./MenuDropdown.css";

export default function MenuDropdown({
  isOpen,
  onClose,
  anchorRef,
  onLeaderboardClick,
  onObjectivesClick,
  onProfileClick,
  onHelpClick,
}) {
  const dropdownRef = useRef(null);

  // Close on outside click / Escape — attach AFTER open to avoid same-click close
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const install = () => {
      if (!mounted) return;

      const handleDocumentClick = (event) => {
        const dropdownEl = dropdownRef.current;
        const anchorEl = anchorRef?.current;
        const target = event.target;

        const insideDropdown = dropdownEl && dropdownEl.contains(target);
        const onAnchor = anchorEl && anchorEl.contains(target);

        if (!insideDropdown && !onAnchor) {
          typeof onClose === "function" && onClose();
        }
      };

      const handleEscape = (event) => {
        if (event.key === "Escape") {
          typeof onClose === "function" && onClose();
        }
      };

      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("click", handleDocumentClick);
        document.removeEventListener("keydown", handleEscape);
      };
    };

    // Defer by one tick so the open click doesn't immediately close it
    const cleanup = setTimeout(install, 0);

    return () => {
      mounted = false;
      clearTimeout(cleanup);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: "🏆", label: "Leaderboard", description: "View top explorers", onClick: onLeaderboardClick },
    { icon: "🎯", label: "Objectives",  description: "Current challenges", onClick: onObjectivesClick },
    { icon: "👤", label: "Profile",     description: "Your stats & progress", onClick: onProfileClick },
    { icon: "❓", label: "Help",         description: "Instructions & tips", onClick: onHelpClick },
  ];

  const handleItemClick = (fn) => () => {
    if (typeof fn === "function") fn();
    typeof onClose === "function" && onClose();
  };

  return (
    <div
      className={`menu-dropdown open`}           // keep your class names; add "open"
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        zIndex: 1000,
        display: "block",                        // force visible even if CSS expects .open
      }}
    >
      <div className="menu-header">
        <h3>🌿 TouchGrass Menu</h3>
      </div>

      <div className="menu-items">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="menu-item"
            onClick={handleItemClick(item.onClick)}
            aria-label={item.label}
            type="button"
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
