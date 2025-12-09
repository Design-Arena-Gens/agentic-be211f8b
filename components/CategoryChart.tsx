'use client';

import {
  ArcElement,
  Chart,
  Legend,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

type CategoryDatum = {
  category: string;
  total: number;
  color: string;
};

type CategoryChartProps = {
  data: CategoryDatum[];
};

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="card">
        <span className="stat-title">Category Mix</span>
        <span className="empty-state">
          Add transactions to see category distribution.
        </span>
      </div>
    );
  }

  const labels = data.map((item) => item.category);
  const dataset = {
    labels,
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 14,
      },
    ],
  };

  const options = {
    cutout: "62%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) =>
            `${context.label}: $${context.parsed.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`,
        },
      },
    },
  };

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="card">
      <span className="stat-title">Category Mix</span>
      <div className="chart-container">
        <Doughnut data={dataset} options={options} />
      </div>
      <div className="legend">
        {data.slice(0, 6).map((item) => (
          <span key={item.category} className="legend-item">
            <span
              className="legend-swatch"
              style={{ backgroundColor: item.color }}
            />
            {item.category} ({Math.round((item.total / total) * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
}
