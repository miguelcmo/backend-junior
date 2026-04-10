const StatsCard = ({ value, label, icon, color = "primary" }) => {
  const colors = {
    primary: "#6366f1",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6"
  };

  return (
    <div className="stat-card">
      {icon && (
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          {icon}
        </div>
      )}
      <div className="stat-value" style={{ color: colors[color] || colors.primary }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatsCard;