import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default function InstituteStatCard({
  title = "Total Students",
  value = "0",
  change,
  changeType = "positive", // positive | negative | neutral
  comparison = "vs. last month",
  icon: Icon,
  iconColor = "#65A5DA",
  iconBackground = "rgba(101, 165, 218, 0.12)",
  description,
  onClick,
  className = "",
}) {
  const changeStyles = {
    positive: {
      color: "#239B72",
      background: "rgba(35, 155, 114, 0.10)",
      Icon: ArrowUpRight,
    },
    negative: {
      color: "#DC6262",
      background: "rgba(220, 98, 98, 0.10)",
      Icon: ArrowDownRight,
    },
    neutral: {
      color: "#8290A5",
      background: "rgba(130, 144, 165, 0.10)",
      Icon: Minus,
    },
  };

  const currentChange = changeStyles[changeType] || changeStyles.neutral;
  const ChangeIcon = currentChange.Icon;

  return (
    <article
      className={`institute-stat-card ${onClick ? "clickable" : ""} ${className}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="institute-stat-card-top">
        <div className="institute-stat-card-heading">
          <span className="institute-stat-card-title">{title}</span>

          {description && (
            <span className="institute-stat-card-description">
              {description}
            </span>
          )}
        </div>

        {Icon && (
          <div
            className="institute-stat-card-icon"
            style={{
              color: iconColor,
              background: iconBackground,
            }}
          >
            <Icon size={21} strokeWidth={1.9} />
          </div>
        )}
      </div>

      <div className="institute-stat-card-bottom">
        <div className="institute-stat-card-value">{value}</div>

        {change !== undefined && change !== null && (
          <div className="institute-stat-card-change-row">
            <span
              className="institute-stat-card-change"
              style={{
                color: currentChange.color,
                background: currentChange.background,
              }}
            >
              <ChangeIcon size={13} strokeWidth={2.4} />
              {change}
            </span>

            {comparison && (
              <span className="institute-stat-card-comparison">
                {comparison}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}