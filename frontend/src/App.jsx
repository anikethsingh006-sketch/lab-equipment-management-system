import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <h2>{title}</h2>

      <p>This module will be implemented in the next development phase.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/equipment" element={<Equipment />} />

        <Route
          path="/issue-return"
          element={<PlaceholderPage title="Issue & Return" />}
        />

        <Route
          path="/maintenance"
          element={<PlaceholderPage title="Maintenance" />}
        />

        <Route
          path="/calibration"
          element={<PlaceholderPage title="Calibration" />}
        />

        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />

        <Route
          path="/users"
          element={<PlaceholderPage title="User Management" />}
        />

        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
