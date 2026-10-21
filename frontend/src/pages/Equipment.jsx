import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getEquipment,
  createEquipment,
  updateEquipment,
} from "../services/equipmentApi";

const INITIAL_FORM = {
  name: "",
  category: "",
  serialNumber: "",
  description: "",
  location: "",
  status: "AVAILABLE",
  purchaseDate: "",
  condition: "GOOD",
};

const STATUS_LABELS = {
  AVAILABLE: "Available",
  BORROWED: "Borrowed",
  MAINTENANCE: "Under Maintenance",
  RETIRED: "Retired",
};

const CONDITION_LABELS = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  DAMAGED: "Damaged",
};

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Load equipment from MongoDB through the backend.
  async function loadEquipment() {
    try {
      setLoading(true);
      setError("");

      const data = await getEquipment();
      setEquipment(data);
    } catch (err) {
      setError(err.message || "Failed to load equipment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEquipment();
  }, []);

  const filteredEquipment = equipment.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (item.serialNumber || "").toLowerCase().includes(searchText) ||
      (item.name || "").toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    setError("");
    setShowForm(true);
  }

  function handleEdit(item) {
    setEditingId(item._id);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      serialNumber: item.serialNumber || "",
      description: item.description || "",
      location: item.location || "",
      status: item.status || "AVAILABLE",
      purchaseDate: item.purchaseDate ? item.purchaseDate.slice(0, 10) : "",
      condition: item.condition || "GOOD",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        serialNumber: formData.serialNumber.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        status: formData.status,
        purchaseDate: formData.purchaseDate || null,
        condition: formData.condition,
      };

      if (editingId) {
        await updateEquipment(editingId, payload);
      } else {
        await createEquipment(payload);
      }

      // Read the latest records back from the database.
      await loadEquipment();

      closeForm();
    } catch (err) {
      setError(err.message || "Failed to save equipment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRetire(item) {
    const confirmed = window.confirm(
      `Retire "${item.name}" (${item.serialNumber})?`,
    );

    if (!confirmed) return;

    try {
      setError("");

      // Retirement updates the record instead of deleting its history.
      await updateEquipment(item._id, {
        status: "RETIRED",
      });

      await loadEquipment();
    } catch (err) {
      setError(err.message || "Failed to retire equipment.");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="dashboard-content">
          <div className="welcome-section">
            <div>
              <h2>Equipment Inventory</h2>
              <p>Search, manage, and register laboratory equipment.</p>
            </div>

            <button
              className="primary-button"
              onClick={showForm ? closeForm : openAddForm}
            >
              {showForm ? "Cancel" : "+ Add Equipment"}
            </button>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {showForm && (
            <section className="panel form-panel">
              <div className="panel-header">
                <div>
                  <h2>{editingId ? "Edit Equipment" : "Register Equipment"}</h2>
                  <p>Enter the equipment details below.</p>
                </div>
              </div>

              <form className="equipment-form" onSubmit={handleSubmit}>
                <label>
                  Equipment Name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Category
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Serial Number
                  <input
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Location
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Condition
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                  >
                    {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Purchase Date
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Description
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Equipment"
                        : "Save Equipment"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="panel">
            <div className="inventory-toolbar">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by serial number or equipment name..."
                aria-label="Search equipment"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>

                {[...new Set(equipment.map((item) => item.category))]
                  .sort()
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>

                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="inventory-count">
              Showing {filteredEquipment.length} of {equipment.length} records
            </div>

            <div className="table-container">
              {loading ? (
                <p className="empty-state">Loading equipment...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>SERIAL NUMBER</th>
                      <th>EQUIPMENT</th>
                      <th>LOCATION</th>
                      <th>STATUS</th>
                      <th>CONDITION</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEquipment.map((item) => (
                      <tr key={item._id}>
                        <td className="asset-id">{item.serialNumber}</td>

                        <td>
                          <div className="equipment-name">{item.name}</div>
                          <div className="equipment-category">
                            {item.category}
                          </div>
                        </td>

                        <td>{item.location}</td>

                        <td>
                          <span className="status-badge">
                            {STATUS_LABELS[item.status] || item.status}
                          </span>
                        </td>

                        <td>
                          {CONDITION_LABELS[item.condition] || item.condition}
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="action-button"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>

                            {item.status !== "RETIRED" && (
                              <button
                                type="button"
                                className="action-button retire-button"
                                onClick={() => handleRetire(item)}
                              >
                                Retire
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredEquipment.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          {error
                            ? "Could not load equipment. Check the error above."
                            : "No equipment matches your search."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
