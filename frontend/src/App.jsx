import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import IssueReturn from "./pages/IssueReturn";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

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

        <Route path="/issue-return" element={<IssueReturn />} />

        <Route path="/maintenance" element={<Maintenance />} />

        <Route path="/reports" element={<Reports />} />

        <Route path="/users" element={<Users />} />

        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}
