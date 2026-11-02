import { useEffect, useState } from "react";

import {
  getActiveIssues,
  issueEquipment,
  returnEquipment,
} from "../services/issueReturnService";

import { getEquipment } from "../services/equipmentApi";

import "./IssueReturn.css";

export default function IssueReturn() {
  const [equipment, setEquipment] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);

  const [form, setForm] = useState({
    equipmentId: "",
    borrowerName: "",
    borrowerId: "",
    expectedReturnDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const availableEquipment = equipment.filter(
    (item) => item.status === "AVAILABLE",
  );

  async function loadData() {
    try {
      setError("");

      const [equipmentResult, issuesResult] = await Promise.all([
        getEquipment(),
        getActiveIssues(),
      ]);

      setEquipment(equipmentResult.data || []);
      setActiveIssues(issuesResult.data || []);
    } catch (err) {
      setError(err.message);
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

  async function handleIssue(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await issueEquipment(form);

      setMessage("Equipment issued successfully!");

      setForm({
        equipmentId: "",
        borrowerName: "",
        borrowerId: "",
        expectedReturnDate: "",
      });

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturn(issueId) {
    if (!window.confirm("Are you sure you want to return this equipment?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await returnEquipment(issueId);

      setMessage("Equipment returned successfully!");

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="issue-page">Loading Issue & Return...</div>;
  }

  return (
    <div className="issue-page">
      <div className="issue-header">
        <div>
          <h1>Issue & Return</h1>
          <p>Manage equipment borrowing and returns.</p>
        </div>
      </div>

      {error && <div className="issue-alert error">{error}</div>}
      {message && <div className="issue-alert success">{message}</div>}

      <div className="issue-summary">
        <div className="issue-summary-card">
          <span>Available Equipment</span>
          <strong>{availableEquipment.length}</strong>
        </div>

        <div className="issue-summary-card">
          <span>Currently Issued</span>
          <strong>{activeIssues.length}</strong>
        </div>
      </div>

      <section className="issue-section">
        <h2>Issue Equipment</h2>

        <form onSubmit={handleIssue} className="issue-form">
          <div className="issue-field">
            <label htmlFor="equipmentId">Select Equipment</label>

            <select
              id="equipmentId"
              name="equipmentId"
              value={form.equipmentId}
              onChange={handleChange}
              required
            >
              <option value="">Choose available equipment</option>

              {availableEquipment.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.serialNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="issue-field">
            <label htmlFor="borrowerName">Borrower Name</label>
            <input
              id="borrowerName"
              name="borrowerName"
              value={form.borrowerName}
              onChange={handleChange}
              placeholder="Enter borrower name"
              required
            />
          </div>

          <div className="issue-field">
            <label htmlFor="borrowerId">Borrower ID</label>
            <input
              id="borrowerId"
              name="borrowerId"
              value={form.borrowerId}
              onChange={handleChange}
              placeholder="Enter student or employee ID"
              required
            />
          </div>

          <div className="issue-field">
            <label htmlFor="expectedReturnDate">Expected Return Date</label>
            <input
              id="expectedReturnDate"
              name="expectedReturnDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.expectedReturnDate}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || availableEquipment.length === 0}
            className="issue-submit"
          >
            {submitting ? "Issuing..." : "Issue Equipment"}
          </button>
        </form>
      </section>

      <section className="issue-section">
        <div className="issue-table-header">
          <div>
            <h2>Currently Issued Equipment</h2>
            <p>Equipment that has not yet been returned.</p>
          </div>

          <button type="button" className="issue-refresh" onClick={loadData}>
            Refresh
          </button>
        </div>

        <div className="issue-table-wrapper">
          <table className="issue-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Serial Number</th>
                <th>Borrower</th>
                <th>Borrower ID</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {activeIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" className="issue-empty">
                    No active issues found.
                  </td>
                </tr>
              ) : (
                activeIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td>{issue.equipment?.name || "Unavailable"}</td>
                    <td>{issue.equipment?.serialNumber || "—"}</td>
                    <td>{issue.borrowerName}</td>
                    <td>{issue.borrowerId}</td>
                    <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                    <td>
                      {new Date(issue.expectedReturnDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="return-button"
                        onClick={() => handleReturn(issue._id)}
                      >
                        Return
                      </button>
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
