'use client';

import type { Expense } from "@/shared/expenses";
import { format, parseISO } from "date-fns";

type ExpenseTableProps = {
  expenses: Expense[];
};

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <div className="card">
      <span className="stat-title">Recent Activity</span>
      {expenses.length === 0 ? (
        <span className="empty-state">
          No transactions match the current filters.
        </span>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense</th>
                <th>Category</th>
                <th>Payment</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{format(parseISO(expense.date), "MMM d")}</td>
                  <td>{expense.name}</td>
                  <td>{expense.category}</td>
                  <td>{expense.paymentMethod}</td>
                  <td style={{ textAlign: "right" }}>
                    ${expense.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
