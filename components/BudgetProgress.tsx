'use client';

type BudgetItem = {
  category: string;
  spent: number;
  budget: number;
  color: string;
};

type BudgetProgressProps = {
  items: BudgetItem[];
};

export function BudgetProgress({ items }: BudgetProgressProps) {
  return (
    <div className="card">
      <span className="stat-title">Budget Progress</span>
      <div className="goals-list">
        {items.map((item) => {
          const progress = Math.min(1, item.spent / item.budget || 0);
          const remainder = item.budget - item.spent;
          const allocation = `$${item.spent.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })} / $${item.budget.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`;

          return (
            <div key={item.category} className="goals-item">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{item.category}</strong>
                <span>{allocation}</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(90deg, ${item.color}, rgba(255,255,255,0.6))`,
                  }}
                />
              </div>
              <span className="trend">
                {remainder >= 0
                  ? `$${remainder.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })} remaining in budget`
                  : `$${Math.abs(remainder).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })} over budget`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
