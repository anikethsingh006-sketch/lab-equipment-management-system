import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import EquipmentTable from "../components/EquipmentTable";
import { equipmentData } from "../data/equipment";

export default function Dashboard() {
  const totalEquipment = equipmentData.length;

  const availableEquipment = equipmentData.filter(
    (item) => item.status === "Available",
  ).length;

  const issuedEquipment = equipmentData.filter(
    (item) => item.status === "Issued",
  ).length;

  const maintenanceEquipment = equipmentData.filter(
    (item) =>
      item.status === "Under Maintenance" ||
      item.status === "Under Calibration",
  ).length;

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
              title="Currently Issued"
              value={issuedEquipment}
              subtitle="Equipment in use"
              icon="⇄"
              color="purple"
            />

            <StatCard
              title="Needs Attention"
              value={maintenanceEquipment}
              subtitle="Maintenance or calibration"
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

              {[
                {
                  name: "Available",
                  count: availableEquipment,
                  color: "bar-green",
                },
                {
                  name: "Issued",
                  count: issuedEquipment,
                  color: "bar-purple",
                },
                {
                  name: "Maintenance",
                  count: equipmentData.filter(
                    (item) => item.status === "Under Maintenance",
                  ).length,
                  color: "bar-orange",
                },
                {
                  name: "Calibration",
                  count: equipmentData.filter(
                    (item) => item.status === "Under Calibration",
                  ).length,
                  color: "bar-blue",
                },
              ].map((item) => (
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
                    ></div>
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
        </div>
      </main>
    </div>
  );
}
