import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: "▦" },
  { name: "Equipment", path: "/equipment", icon: "▤" },
  { name: "Issue / Return", path: "/issue-return", icon: "⇄" },
  { name: "Maintenance", path: "/maintenance", icon: "⚙" },
  { name: "Calibration", path: "/calibration", icon: "◷" },
  { name: "Reports", path: "/reports", icon: "▥" },
  { name: "User Management", path: "/users", icon: "♙" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">L</div>

        <div>
          <h2>LabTrack</h2>
          <p>Equipment Management</p>
        </div>
      </div>

      <div className="menu-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">AD</div>

        <div>
          <strong>Administrator</strong>
          <p>System Admin</p>
        </div>
      </div>
    </aside>
  );
}
