import { useEffect, useState } from "react";
import { getEquipment } from "../services/equipmentApi";

const STATUS_LABELS = {
  AVAILABLE: "Available",
  BORROWED: "Issued",
  MAINTENANCE: "Under Maintenance",
  RETIRED: "Retired",
};

const CONDITION_LABELS = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  DAMAGED: "Damaged",
};

export default function EquipmentTable() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setError("");
        const data = await getEquipment();
        setEquipment(data);
      } catch (err) {
        setError(err.message || "Failed to load equipment.");
      } finally {
        setLoading(false);
      }
    }

    fetchEquipment();
  }, []);

  // Show the 5 most recently registered records.
  const recentEquipment = [...equipment]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Recent Equipment</h2>
          <p>Overview of recently registered equipment</p>
        </div>

        <button
          type="button"
          className="text-button"
          onClick={() => {
            window.location.href = "/equipment";
          }}
        >
          View all →
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Loading equipment...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SERIAL NUMBER</th>
                <th>EQUIPMENT</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th>CONDITION</th>
              </tr>
            </thead>

            <tbody>
              {recentEquipment.map((item) => (
                <tr key={item._id}>
                  <td className="asset-id">{item.serialNumber}</td>

                  <td>
                    <div className="equipment-name">{item.name}</div>
                    <div className="equipment-category">{item.category}</div>
                  </td>

                  <td>{item.location}</td>

                  <td>
                    <span className="status-badge">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>

                  <td>{CONDITION_LABELS[item.condition] || item.condition}</td>
                </tr>
              ))}

              {recentEquipment.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No equipment registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
