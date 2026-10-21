export default function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>

        <div className={`stat-icon ${color}`}>{icon}</div>
      </div>

      <div className="stat-value">{value}</div>

      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}
