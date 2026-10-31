
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  MoreHorizontal,
} from "lucide-react";

const DEFAULT_COLORS = [
  "#65A5DA",
  "#8B83D9",
  "#55B98E",
  "#E8A65C",
  "#E47F9B",
];

const CHART_ICONS = {
  bar: BarChart3,
  line: TrendingUp,
  area: Activity,
  donut: PieChartIcon,
};

function ChartTooltip({ active, payload, label, formatter, donut }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="institute-chart-tooltip">
      {label && !donut && <strong>{label}</strong>}

      {payload.map((item, index) => (
        <div className="institute-chart-tooltip-row" key={`${item.dataKey || item.name}-${index}`}>
          <span
            className="institute-chart-tooltip-dot"
            style={{ background: item.color || item.payload?.fill }}
          />
          <span>{item.name || item.dataKey}</span>
          <strong>
            {formatter
              ? formatter(item.value, item.name || item.dataKey)
              : item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function ChartLegend({ series, data, nameKey, valueKey, colors }) {
  const items =
    series?.length > 0
      ? series
      : data.map((item, index) => ({
          dataKey: item[nameKey],
          label: item[nameKey],
          color: colors[index % colors.length],
          value: item[valueKey],
        }));

  return (
    <div className="institute-chart-legend">
      {items.map((item, index) => (
        <div className="institute-chart-legend-item" key={item.dataKey || item.label || index}>
          <span
            className="institute-chart-legend-dot"
            style={{
              background: item.color || colors[index % colors.length],
            }}
          />
          <span>{item.label || item.dataKey}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChartCard({
  title = "Chart overview",
  subtitle = "Performance overview",
  type = "bar",
  data = [],
  xKey = "name",
  series = [],
  nameKey = "name",
  valueKey = "value",
  height = 280,
  colors = DEFAULT_COLORS,
  showLegend = true,
  showGrid = true,
  showYAxis = true,
  showXAxis = true,
  showTooltip = true,
  showHeader = true,
  showFilter = false,
  filterValue = "This month",
  filterOptions = ["This week", "This month", "This year"],
  onFilterChange,
  loading = false,
  emptyMessage = "No data available yet.",
  formatter,
  stacked = false,
  horizontal = false,
  showValues = false,
  centerLabel,
  centerValue,
  footer,
  className = "",
  onMenuClick,
}) {
  const normalizedType = type.toLowerCase();
  const isDonut = normalizedType === "donut";
  const ChartIcon = CHART_ICONS[normalizedType] || BarChart3;

  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    (isDonut
      ? data.some((item) => Number(item[valueKey]) !== 0)
      : data.some((item) =>
          series.some((itemSeries) => Number(item[itemSeries.dataKey]) !== 0)
        ));

  const chartSeries =
    series.length > 0
      ? series
      : [
          {
            dataKey: valueKey,
            label: valueKey,
            color: colors[0],
          },
        ];

  const renderCartesianChart = () => {
    const commonProps = {
      data,
      layout: horizontal ? "vertical" : "horizontal",
      margin: { top: 12, right: 10, left: 0, bottom: 3 },
    };

    const axes = (
      <>
        {showGrid && (
          <CartesianGrid
            stroke="#edf1f6"
            strokeDasharray="4 4"
            vertical={false}
          />
        )}

        {showXAxis && (
          <XAxis
            dataKey={horizontal ? undefined : xKey}
            type={horizontal ? "number" : "category"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#96A3B3", fontSize: 10 }}
            tickMargin={10}
          />
        )}

        {showYAxis && (
          <YAxis
            dataKey={horizontal ? xKey : undefined}
            type={horizontal ? "category" : "number"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#96A3B3", fontSize: 10 }}
            tickMargin={8}
            width={horizontal ? 95 : 42}
          />
        )}

        {showTooltip && (
          <Tooltip
            content={<ChartTooltip formatter={formatter} />}
            cursor={{ fill: "rgba(100, 160, 215, 0.07)" }}
          />
        )}

        {showLegend && chartSeries.length > 1 && (
          <Legend content={() => (
            <ChartLegend series={chartSeries} colors={colors} />
          )} />
        )}
      </>
    );

    if (normalizedType === "line") {
      return (
        <LineChart {...commonProps}>
          {axes}
          {chartSeries.map((item, index) => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.label || item.dataKey}
              stroke={item.color || colors[index % colors.length]}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      );
    }

    if (normalizedType === "area") {
      return (
        <AreaChart {...commonProps}>
          {axes}
          {chartSeries.map((item, index) => (
            <Area
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.label || item.dataKey}
              stroke={item.color || colors[index % colors.length]}
              fill={item.color || colors[index % colors.length]}
              fillOpacity={0.14}
              strokeWidth={2.5}
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        {axes}
        {chartSeries.map((item, index) => (
          <Bar
            key={item.dataKey}
            dataKey={item.dataKey}
            name={item.label || item.dataKey}
            fill={item.color || colors[index % colors.length]}
            radius={horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]}
            maxBarSize={38}
            stackId={stacked ? "stack" : undefined}
            label={showValues ? { position: horizontal ? "right" : "top", fontSize: 9, fill: "#8291a4" } : false}
          />
        ))}
      </BarChart>
    );
  };

  const renderDonutChart = () => (
    <PieChart>
      <Tooltip
        content={<ChartTooltip formatter={formatter} donut />}
      />
      <Pie
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        innerRadius="59%"
        outerRadius="82%"
        paddingAngle={3}
        cornerRadius={4}
        stroke="none"
      >
        {data.map((item, index) => (
          <Cell
            key={`${item[nameKey]}-${index}`}
            fill={item.color || colors[index % colors.length]}
          />
        ))}
      </Pie>
      {centerLabel && (
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="institute-chart-center-label"
        >
          {centerLabel}
        </text>
      )}
      {centerValue && (
        <text
          x="50%"
          y="57%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="institute-chart-center-value"
        >
          {centerValue}
        </text>
      )}
    </PieChart>
  );

  return (
    <section className={`institute-chart-card ${className}`}>
      {showHeader && (
        <div className="institute-chart-header">
          <div className="institute-chart-heading">
            <div className="institute-chart-icon">
              <ChartIcon size={18} />
            </div>
            <div>
              <h3>{title}</h3>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>

          <div className="institute-chart-header-actions">
            {showFilter && (
              <select
                className="institute-chart-filter"
                value={filterValue}
                onChange={(event) => onFilterChange?.(event.target.value)}
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {onMenuClick && (
              <button
                className="institute-chart-menu"
                onClick={onMenuClick}
                aria-label="Chart options"
              >
                <MoreHorizontal size={19} />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="institute-chart-body" style={{ height }}>
        {loading ? (
          <div className="institute-chart-state">
            <div className="institute-chart-loader" />
            <span>Loading chart data...</span>
          </div>
        ) : !hasData ? (
          <div className="institute-chart-state">
            <ChartIcon size={30} />
            <strong>No chart data</strong>
            <span>{emptyMessage}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {isDonut ? renderDonutChart() : renderCartesianChart()}
          </ResponsiveContainer>
        )}
      </div>

      {showLegend && isDonut && hasData && (
        <ChartLegend
          data={data}
          nameKey={nameKey}
          valueKey={valueKey}
          colors={colors}
        />
      )}

      {footer && (
        <div className="institute-chart-footer">
          {footer}
        </div>
      )}
    </section>
  );
}
