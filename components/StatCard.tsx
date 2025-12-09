'use client';

import clsx from "clsx";

export type StatCardProps = {
  title: string;
  value: string;
  changeLabel?: string;
  changeDirection?: "up" | "down";
  hint?: string;
};

export function StatCard({
  title,
  value,
  changeLabel,
  changeDirection,
  hint,
}: StatCardProps) {
  return (
    <div className="card">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
      {changeLabel ? (
        <span className={clsx("stat-change", changeDirection === "down" && "down")}>
          {changeLabel}
        </span>
      ) : null}
      {hint ? <span className="trend">{hint}</span> : null}
    </div>
  );
}
