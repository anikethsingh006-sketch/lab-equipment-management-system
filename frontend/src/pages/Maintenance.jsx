import { useEffect, useState } from "react";

import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenance,
} from "../services/maintenanceService";

import { getEquipment } from "../services/equipmentService";

import "./Maintenance.css";

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [form, setForm] = useState({
    equipmentId: "",
    description: "",
    priority: "MEDIUM",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const availableEquipment = equipment.filter(
    (item) => item.status !== "RETIRED" && item.status !== "BORROWED",
  );

  const openCount = maintenance.filter((item) => item.status === "OPEN").length;

  const inProgressCount = maintenance.filter(
    (item) => item.status === "IN_PROGRESS",
  ).length;

  const resolvedCount = maintenance.filter(
    (item) => item.status === "RESOLVED",
  ).length;

  async function loadData() {
    try {
      setError("");

      const [maintenanceResult, equipmentResult] = await Promise.all([
        getAllMaintenance(),
        getEquipment(),
      ]);

      setMaintenance(maintenanceResult.data || []);
      setEquipment(equipmentResult.data || []);
    } catch (err) {
      setError(err.message || "Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await createMaintenance(form);

      setMessage("Maintenance report created successfully!");

      setForm({
        equipmentId: "",
        description: "",
        priority: "MEDIUM",
      });

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      setUpdatingId(id);
      setError("");
      setMessage("");

      await updateMaintenance(id, status);

      setMessage("Maintenance status updated successfully!");

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <div className="maintenance-page">Loading maintenance...</div>;
  }

  return (
    <div className="maintenance-page">
      <div className="maintenance-header">
        <div>
          <h1>Maintenance Management</h1>
          <p>Track equipment repairs and maintenance activities.</p>
        </div>

        <button
          type="button"
          className="maintenance-refresh"
          onClick={loadData}
        >
          Refresh
        </button>
      </div>

      {error && <div className="maintenance-alert error">{error}</div>}

      {message && <div className="maintenance-alert success">{message}</div>}

      {/* STATISTICS */}

      <div className="maintenance-stats">
        <div className="maintenance-stat-card">
          <span>Open Reports</span>
          <strong>{openCount}</strong>
        </div>

        <div className="maintenance-stat-card">
          <span>In Progress</span>
          <strong>{inProgressCount}</strong>
        </div>

        <div className="maintenance-stat-card">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
        </div>

        <div className="maintenance-stat-card">
          <span>Total Reports</span>
          <strong>{maintenance.length}</strong>
        </div>
      </div>

      {/* CREATE MAINTENANCE REPORT */}

      <section className="maintenance-section">
        <h2>Report Equipment Maintenance</h2>

        <form className="maintenance-form" onSubmit={handleCreate}>
          <div className="maintenance-field">
            <label htmlFor="equipmentId">Select Equipment</label>

            <select
              id="equipmentId"
              name="equipmentId"
              value={form.equipmentId}
              onChange={handleChange}
              required
            >
              <option value="">Choose equipment</option>

              {availableEquipment.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.serialNumber})
                </option>
              ))}
            </select>

            {availableEquipment.length === 0 && (
              <small>No eligible equipment available.</small>
            )}
          </div>

          <div className="maintenance-field">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="maintenance-field full-width">
            <label htmlFor="description">Problem Description</label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the equipment problem..."
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="maintenance-submit"
            disabled={submitting || availableEquipment.length === 0}
          >
            {submitting ? "Submitting..." : "Create Maintenance Report"}
          </button>
        </form>
      </section>

      {/* MAINTENANCE RECORDS */}

      <section className="maintenance-section">
        <div className="maintenance-table-heading">
          <div>
            <h2>Maintenance Records</h2>
            <p>View and manage all maintenance reports.</p>
          </div>
        </div>

        <div className="maintenance-table-wrapper">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Serial Number</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported On</th>
                <th>Resolved On</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {maintenance.length === 0 ? (
                <tr>
                  <td colSpan="8" className="maintenance-empty">
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                maintenance.map((item) => (
                  <tr key={item._id}>
                    <td>{item.equipment?.name || "Unavailable"}</td>

                    <td>{item.equipment?.serialNumber || "—"}</td>

                    <td className="maintenance-description">
                      {item.description}
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${item.priority.toLowerCase()}`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${item.status.toLowerCase()}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>

                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                    <td>
                      {item.resolvedAt
                        ? new Date(item.resolvedAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <select
                        value={item.status}
                        disabled={updatingId === item._id}
                        onChange={(event) =>
                          handleStatusChange(item._id, event.target.value)
                        }
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
