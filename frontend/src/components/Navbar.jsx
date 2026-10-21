import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/equipment": "Equipment Inventory",
  "/issue-return": "Issue & Return",
  "/maintenance": "Maintenance",
  "/calibration": "Calibration",
  "/reports": "Reports",
  "/users": "User Management",
};

export default function Navbar() {
  const location = useLocation();

  const title = pageTitles[location.pathname] || "Laboratory Management";

  return (
    <header className="navbar">
      <div>
        <p className="breadcrumb">Workspace / {title}</p>
        <h1>{title}</h1>
      </div>

      <div className="navbar-actions">
        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          ♧
        </button>

        <div className="navbar-avatar">AD</div>
      </div>
    </header>
  );
}
