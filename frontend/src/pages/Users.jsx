import { useEffect, useState } from "react";

import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
} from "../services/userService";

import "./Users.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "STUDENT",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadUsers() {
    try {
      setError("");
      const result = await getAllUsers();
      setUsers(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminUsers = users.filter((user) => user.role === "ADMIN").length;

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
    setMessage("");
  }

  function openEditForm(user) {
    setEditingId(user._id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateUser(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });

        setMessage("User updated successfully!");
      } else {
        await createUser(form);
        setMessage("User created successfully!");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusToggle(user) {
    try {
      setError("");
      setMessage("");

      await updateUserStatus(user._id, !user.isActive);

      setMessage(
        `User ${user.isActive ? "deactivated" : "activated"} successfully!`,
      );

      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="users-page">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage laboratory users, roles and account status.</p>
        </div>

        <button className="users-add-btn" onClick={openCreateForm}>
          + Add User
        </button>
      </div>

      {error && <div className="users-alert error">{error}</div>}
      {message && <div className="users-alert success">{message}</div>}

      <div className="users-stats">
        <div className="users-stat-card">
          <span>Total Users</span>
          <strong>{totalUsers}</strong>
        </div>

        <div className="users-stat-card">
          <span>Active Users</span>
          <strong>{activeUsers}</strong>
        </div>

        <div className="users-stat-card">
          <span>Inactive Users</span>
          <strong>{inactiveUsers}</strong>
        </div>

        <div className="users-stat-card">
          <span>Administrators</span>
          <strong>{adminUsers}</strong>
        </div>
      </div>

      {showForm && (
        <section className="users-section">
          <div className="users-form-heading">
            <h2>{editingId ? "Edit User" : "Add New User"}</h2>

            <button
              type="button"
              className="users-cancel-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancel
            </button>
          </div>

          <form className="users-form" onSubmit={handleSubmit}>
            <div className="users-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="users-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {!editingId && (
              <div className="users-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength="8"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="users-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="STUDENT">Student</option>
                <option value="LAB_ASSISTANT">Lab Assistant</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="users-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update User"
                  : "Create User"}
            </button>
          </form>
        </section>
      )}

      <section className="users-section">
        <div className="users-table-heading">
          <div>
            <h2>All Users</h2>
            <p>View and manage registered users.</p>
          </div>

          <input
            className="users-search"
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="users-empty">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`user-status ${
                          user.isActive ? "active" : "inactive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                    <td>
                      <div className="users-actions">
                        <button
                          className="users-edit-btn"
                          onClick={() => openEditForm(user)}
                        >
                          Edit
                        </button>

                        <button
                          className={`users-toggle-btn ${
                            user.isActive ? "deactivate" : "activate"
                          }`}
                          onClick={() => handleStatusToggle(user)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
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
