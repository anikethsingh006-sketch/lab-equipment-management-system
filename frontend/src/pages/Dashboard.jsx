import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import EquipmentTable from "../components/EquipmentTable";
import { getEquipment } from "../services/equipmentApi";

export default function Dashboard() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEquipment() {
      try {
        setLoading(true);
        setError("");

        const data = await getEquipment();
        setEquipmentData(data);
      } catch (err) {
        setError(err.message || "Failed to load equipment.");
      } finally {
        setLoading(false);
      }
    }

    fetchEquipment();
  }, []);

  const totalEquipment = equipmentData.length;

  const availableEquipment = equipmentData.filter(
    (item) => item.status === "AVAILABLE",
  ).length;

  const issuedEquipment = equipmentData.filter(
    (item) => item.status === "BORROWED",
  ).length;

  const maintenanceEquipment = equipmentData.filter(
    (item) => item.status === "MAINTENANCE",
  ).length;

  const retiredEquipment = equipmentData.filter(
    (item) => item.status === "RETIRED",
  ).length;

  const statusDistribution = [
    {
      name: "Available",
      count: availableEquipment,
      color: "bar-green",
    },
    {
      name: "Borrowed",
      count: issuedEquipment,
      color: "bar-purple",
    },
    {
      name: "Maintenance",
      count: maintenanceEquipment,
      color: "bar-orange",
    },
    {
      name: "Retired",
      count: retiredEquipment,
      color: "bar-blue",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="dashboard-content">
          <div className="welcome-section">
            <div>
              <h2>Laboratory Overview</h2>
              <p>Monitor equipment availability, usage, and maintenance.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                window.location.href = "/equipment";
              }}
            >
              + Manage Equipment
            </button>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading dashboard...</p>
          ) : (
            <>
              <section className="stats-grid">
                <StatCard
                  title="Total Equipment"
                  value={totalEquipment}
                  subtitle="Registered assets"
                  icon="▤"
                  color="blue"
                />

                <StatCard
                  title="Available"
                  value={availableEquipment}
                  subtitle="Ready for use"
                  icon="✓"
                  color="green"
                />

                <StatCard
                  title="Currently Borrowed"
                  value={issuedEquipment}
                  subtitle="Equipment in use"
                  icon="⇄"
                  color="purple"
                />

                <StatCard
                  title="Needs Attention"
                  value={maintenanceEquipment}
                  subtitle="Under maintenance"
                  icon="!"
                  color="orange"
                />
              </section>

              <section className="dashboard-grid">
                <EquipmentTable />

                <section className="panel quick-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Quick Overview</h2>
                      <p>Equipment status distribution</p>
                    </div>
                  </div>

                  {statusDistribution.map((item) => (
                    <div className="distribution-item" key={item.name}>
                      <div className="distribution-label">
                        <span>{item.name}</span>
                        <strong>{item.count}</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className={`progress-bar ${item.color}`}
                          style={{
                            width: `${
                              totalEquipment
                                ? (item.count / totalEquipment) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="overview-note">
                    <strong>Remember</strong>
                    <p>
                      Equipment under maintenance must not be issued until an
                      authorized user releases it.
                    </p>
                  </div>
                </section>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
