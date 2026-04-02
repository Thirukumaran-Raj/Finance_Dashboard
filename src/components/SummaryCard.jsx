function SummaryCard({ title, value, subtitle, variant }) {
  return (
    <div className={`summary-card ${variant}`}>
      <div className="summary-card__shine" />
      <div className="summary-card__title">{title}</div>
      <div className="summary-card__value">₹ {value.toLocaleString("en-IN")}</div>
      <div className="summary-card__subtitle">{subtitle}</div>
    </div>
  );
}

export default SummaryCard;