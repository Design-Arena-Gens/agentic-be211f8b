'use client';

import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Filler
);

type TrendPoint = {
  label: string;
  total: number;
};

type TrendChartProps = {
  points: TrendPoint[];
};

export function TrendChart({ points }: TrendChartProps) {
  const labels = points.map((point) => point.label);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly spend",
        data: points.map((point) => point.total),
        fill: true,
        borderColor: "rgba(74, 147, 255, 1)",
        backgroundColor: "rgba(74, 147, 255, 0.2)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false as const,
        mode: "index" as const,
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            ` $${(context.parsed.y ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca9cc",
        },
      },
      y: {
        grid: {
          color: "rgba(96, 106, 138, 0.15)",
        },
        ticks: {
          color: "#9ca9cc",
          callback: (value: string | number) =>
            `$${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="card">
      <span className="stat-title">Spending Trend</span>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
      <span className="trend">
        Tracking the last {points.length} months of spending.
      </span>
    </div>
  );
}
