function StatCard({ title, value, hint, icon, tone = "default" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon" aria-hidden="true">{icon}</div>
      </div>

      <h2>{value}</h2>

      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}

export default StatCard;
