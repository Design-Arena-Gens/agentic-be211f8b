'use client';

import type { Expense } from "@/shared/expenses";
import { format } from "date-fns";

type UpcomingBill = Expense & { dueDate: Date };

type UpcomingBillsProps = {
  bills: UpcomingBill[];
};

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  return (
    <div className="card">
      <span className="stat-title">Upcoming Bills</span>
      {bills.length === 0 ? (
        <span className="empty-state">
          No recurring payments due in the next cycle.
        </span>
      ) : (
        <div className="goals-list">
          {bills.map((bill) => (
            <div key={bill.id} className="goals-item">
              <strong>{bill.name}</strong>
              <span className="trend">
                Due {format(bill.dueDate, "EEEE, MMM d")} · {bill.paymentMethod}
              </span>
              <span className="pill">${bill.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
