import { useEffect, useState } from "react";

import { getEquipmentAnalytics } from "../services/reportService";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./Reports.css";

const COLORS = [
  "#3159a8",
  "#16a085",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

export default function Reports() {
  const [analytics, setAnalytics] = useState({
    categoryStats: [],
    locationStats: [],
    conditionStats: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const result = await getEquipmentAnalytics();
        setAnalytics(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  if (loading) {
    return <div className="reports-page">Loading reports...</div>;
  }

  if (error) {
    return <div className="reports-page reports-error">{error}</div>;
  }

  const renderEmpty = (data) =>
    data.length === 0 ? (
      <p className="reports-empty">No data available.</p>
    ) : null;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>
            Explore equipment distribution and laboratory inventory insights.
          </p>
        </div>
      </div>

      <section className="reports-section">
        <h2>Equipment by Category</h2>
        {renderEmpty(analytics.categoryStats)}

        {analytics.categoryStats.length > 0 && (
          <div className="reports-chart">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3159a8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <div className="reports-grid">
        <section className="reports-section">
          <h2>Equipment by Location</h2>
          {renderEmpty(analytics.locationStats)}

          {analytics.locationStats.length > 0 && (
            <div className="reports-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.locationStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {analytics.locationStats.map((entry, index) => (
                      <Cell
                        key={entry._id}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="reports-section">
          <h2>Equipment by Condition</h2>
          {renderEmpty(analytics.conditionStats)}

          {analytics.conditionStats.length > 0 && (
            <div className="reports-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.conditionStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {analytics.conditionStats.map((entry, index) => (
                      <Cell
                        key={entry._id}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
