'use client';

import { useCallback, useMemo, useState } from "react";
import { FiltersBar } from "@/components/FiltersBar";
import { StatCard, type StatCardProps } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { CategoryChart } from "@/components/CategoryChart";
import { UpcomingBills } from "@/components/UpcomingBills";
import { ExpenseTable } from "@/components/ExpenseTable";
import { BudgetProgress } from "@/components/BudgetProgress";
import {
  expenses,
  getMonthOptions,
  getCategoryOptions,
  getMonthlyTotals,
  getCategoryTotals,
  getCategoryBudgetProgress,
  getUpcomingBills,
  categoryBudgets,
  type Expense,
} from "@/shared/expenses";
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns";

const formatCurrency = (value: number, maximumFractionDigits = 0) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })}`;

const DASHBOARD_TRANSACTIONS_LIMIT = 9;

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const today = useMemo(() => new Date(), []);

  const actualExpenses = useMemo(
    () => expenses.filter((expense) => parseISO(expense.date) <= today),
    [today]
  );

  const monthOptions = useMemo(
    () => getMonthOptions(actualExpenses),
    [actualExpenses]
  );

  const categoryOptions = useMemo(() => getCategoryOptions(), []);

  const monthlyTotals = useMemo(
    () => getMonthlyTotals(actualExpenses, 11),
    [actualExpenses]
  );

  const currentMonthStart = startOfMonth(today);

  const currentMonth =
    monthlyTotals[monthlyTotals.length - 1] ?? {
      label: format(currentMonthStart, "MMM"),
      month: currentMonthStart,
      total: 0,
    };
  const previousMonth = monthlyTotals[monthlyTotals.length - 2];

  const recentMonths = monthlyTotals.slice(-6);
  const totalRollingSpend = monthlyTotals.reduce(
    (sum, month) => sum + month.total,
    0
  );
  const monthChange =
    previousMonth && previousMonth.total > 0
      ? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
      : 0;

  const currentMonthExpenses = useMemo(
    () =>
      actualExpenses.filter((expense) =>
        isSameMonth(parseISO(expense.date), currentMonthStart)
      ),
    [actualExpenses, currentMonthStart]
  );

  const topCategories = useMemo(() => {
    return getCategoryTotals(currentMonthExpenses).sort(
      (a, b) => b.total - a.total
    );
  }, [currentMonthExpenses]);

  const topCategory = topCategories[0];
  const runnerUpCategory = topCategories[1];

  const savingsContribution = currentMonthExpenses
    .filter((expense) => expense.category === "Savings")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const averageMonthlySpend =
    monthlyTotals.length > 0 ? totalRollingSpend / monthlyTotals.length : 0;

  const filterMatch = useCallback(
    (expense: Expense) => {
      if (selectedMonth !== "all") {
        const expenseMonth = format(parseISO(expense.date), "yyyy-MM");
        if (expenseMonth !== selectedMonth) {
          return false;
        }
      }

      if (selectedCategory !== "all" && expense.category !== selectedCategory) {
        return false;
      }

      return true;
    },
    [selectedCategory, selectedMonth]
  );

  const categoryTotals = useMemo(() => {
    const baselineList =
      selectedMonth === "all" && selectedCategory === "all"
        ? actualExpenses
        : expenses;
    return getCategoryTotals(baselineList.filter(filterMatch));
  }, [actualExpenses, filterMatch, selectedCategory, selectedMonth]);

  const budgetProgress = useMemo(
    () => getCategoryBudgetProgress(actualExpenses).slice(0, 4),
    [actualExpenses]
  );

  const upcomingBills = useMemo(() => getUpcomingBills(expenses), []);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(filterMatch)
      .sort(
        (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
      )
      .slice(0, DASHBOARD_TRANSACTIONS_LIMIT);
  }, [filterMatch]);

  const summaryCards: StatCardProps[] = [
    {
      title: "Rolling 12-Month Spend",
      value: formatCurrency(totalRollingSpend),
      changeLabel: `Avg ${formatCurrency(averageMonthlySpend)} / mo`,
      hint: `${monthlyTotals.length} months of tracked spending.`,
    },
    {
      title: format(currentMonth.month, "MMMM yyyy"),
      value: formatCurrency(currentMonth.total),
      changeLabel: `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(
        1
      )}% vs last month`,
      changeDirection: monthChange >= 0 ? "up" : "down",
      hint: topCategory && currentMonth.total > 0
        ? `${topCategory.category} makes up ${Math.round(
            (topCategory.total / currentMonth.total) * 100
          )}% this month.`
        : undefined,
    },
    {
      title: "Top Category",
      value: topCategory
        ? `${topCategory.category} · ${formatCurrency(topCategory.total)}`
        : "No data yet",
      hint: runnerUpCategory
        ? `Runner-up: ${runnerUpCategory.category} (${formatCurrency(
            runnerUpCategory.total
          )})`
        : "Diversify to reveal more insights.",
    },
    {
      title: "Savings Contributions",
      value: formatCurrency(savingsContribution),
      changeLabel: `Goal ${formatCurrency(categoryBudgets["Savings"])}`,
      hint: `${
        categoryBudgets["Savings"] - savingsContribution >= 0
          ? "On track to hit savings goal."
          : "Savings goal exceeded this month!"
      }`,
    },
  ];

  return (
    <main className="page">
      <header>
        <h1>Personal Expense Dashboard</h1>
        <p>
          Monitor cash flow, upcoming bills, and spending momentum at a glance.
        </p>
      </header>

      <FiltersBar
        monthOptions={monthOptions}
        categoryOptions={categoryOptions}
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        onMonthChange={setSelectedMonth}
        onCategoryChange={setSelectedCategory}
        onReset={() => {
          setSelectedMonth("all");
          setSelectedCategory("all");
        }}
      />

      <section className="grid summary-grid">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid charts-grid">
        <TrendChart points={recentMonths} />
        <CategoryChart data={categoryTotals} />
      </section>

      <section className="grid bottom-grid">
        <BudgetProgress items={budgetProgress} />
        <UpcomingBills bills={upcomingBills} />
        <ExpenseTable expenses={filteredExpenses} />
      </section>
    </main>
  );
}
