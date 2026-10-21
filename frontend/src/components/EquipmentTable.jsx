import { equipmentData } from "../data/equipment";

function getStatusClass(status) {
  switch (status) {
    case "Available":
      return "available";

    case "Issued":
      return "issued";

    case "Under Maintenance":
      return "maintenance";

    case "Under Calibration":
      return "calibration";

    default:
      return "retired";
  }
}

export default function EquipmentTable() {
  const recentEquipment = equipmentData.slice(0, 5);

  return (
    <section className="panel equipment-panel">
      <div className="panel-header">
        <div>
          <h2>Recent Equipment</h2>
          <p>Overview of recently registered equipment</p>
        </div>

        <a href="/equipment" className="view-all">
          View all →
        </a>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ASSET ID</th>
              <th>EQUIPMENT</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>CONDITION</th>
            </tr>
          </thead>

          <tbody>
            {recentEquipment.map((equipment) => (
              <tr key={equipment.id}>
                <td className="asset-id">{equipment.id}</td>

                <td>
                  <div className="equipment-name">{equipment.name}</div>

                  <div className="equipment-category">{equipment.category}</div>
                </td>

                <td>{equipment.location}</td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(
                      equipment.status,
                    )}`}
                  >
                    {equipment.status}
                  </span>
                </td>

                <td>{equipment.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
