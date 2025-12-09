import {
  addMonths,
  eachMonthOfInterval,
  format,
  formatISO,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameMonth,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";

export type ExpenseCategory =
  | "Housing"
  | "Utilities"
  | "Groceries"
  | "Dining"
  | "Transportation"
  | "Entertainment"
  | "Healthcare"
  | "Subscriptions"
  | "Travel"
  | "Savings"
  | "Miscellaneous";

export type Frequency = "monthly" | "quarterly" | "yearly";

export type Expense = {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  note?: string;
  recurring?: boolean;
  frequency?: Frequency;
};

const BASE_CATEGORIES: ExpenseCategory[] = [
  "Housing",
  "Utilities",
  "Groceries",
  "Dining",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Subscriptions",
  "Travel",
  "Savings",
  "Miscellaneous",
];

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Housing: "#8B5CF6",
  Utilities: "#14B8A6",
  Groceries: "#F97316",
  Dining: "#F43F5E",
  Transportation: "#0EA5E9",
  Entertainment: "#FACC15",
  Healthcare: "#6366F1",
  Subscriptions: "#22D3EE",
  Travel: "#EC4899",
  Savings: "#34D399",
  Miscellaneous: "#9CA3AF",
};

const CATEGORY_BUDGETS: Record<ExpenseCategory, number> = {
  Housing: 1900,
  Utilities: 260,
  Groceries: 650,
  Dining: 320,
  Transportation: 220,
  Entertainment: 180,
  Healthcare: 150,
  Subscriptions: 120,
  Travel: 450,
  Savings: 750,
  Miscellaneous: 120,
};

const now = new Date();
const baseMonth = startOfMonth(now);

const makeDate = (offsetMonths: number, dayOfMonth: number) => {
  const monthDate = addMonths(baseMonth, offsetMonths);
  const safeDay = Math.min(dayOfMonth, getDaysInMonth(monthDate));
  const date = new Date(monthDate);
  date.setDate(safeDay);
  date.setHours(12, 0, 0, 0);
  return formatISO(date);
};

type SeriesConfig = {
  idPrefix: string;
  name: string;
  category: ExpenseCategory;
  amounts: number[];
  startOffset: number;
  day: number;
  paymentMethod: string;
  recurring?: boolean;
  frequency?: Frequency;
  note?: string;
};

const buildExpenses = () => {
  const items: Expense[] = [];

  const addSeries = (config: SeriesConfig) => {
    config.amounts.forEach((amount, index) => {
      const offset = config.startOffset - index;
      items.push({
        id: `${config.idPrefix}-${index}`,
        name: config.name,
        category: config.category,
        amount,
        date: makeDate(offset, config.day),
        paymentMethod: config.paymentMethod,
        note: config.note,
        recurring: config.recurring,
        frequency: config.frequency,
      });
    });
  };

  addSeries({
    idPrefix: "rent",
    name: "Downtown Apartment Rent",
    category: "Housing",
    amounts: new Array(12).fill(1850),
    startOffset: 0,
    day: 1,
    paymentMethod: "ACH Transfer",
    recurring: true,
    frequency: "monthly",
  });

  addSeries({
    idPrefix: "utilities",
    name: "Metro Energy & Water",
    category: "Utilities",
    amounts: [190, 205, 188, 195, 182, 178, 210, 198, 205, 214, 199, 206],
    startOffset: 0,
    day: 5,
    paymentMethod: "Visa Sapphire",
    recurring: true,
    frequency: "monthly",
  });

  addSeries({
    idPrefix: "groceries",
    name: "Local Market Groceries",
    category: "Groceries",
    amounts: [612, 584, 630, 598, 672, 648, 610, 655, 602, 661, 640, 588],
    startOffset: 0,
    day: 9,
    paymentMethod: "Amex Blue",
  });

  addSeries({
    idPrefix: "dining",
    name: "Dining & Takeout",
    category: "Dining",
    amounts: [285, 312, 265, 298, 305, 276, 254, 289, 301, 260, 272, 294],
    startOffset: 0,
    day: 18,
    paymentMethod: "Amex Blue",
    note: "Includes weekend dining and coffee shops.",
  });

  addSeries({
    idPrefix: "transport",
    name: "Ride Share & Transit",
    category: "Transportation",
    amounts: [162, 148, 176, 154, 141, 169, 182, 174, 167, 158, 149, 186],
    startOffset: 0,
    day: 22,
    paymentMethod: "Visa Sapphire",
  });

  addSeries({
    idPrefix: "subscriptions",
    name: "Digital Subscriptions Bundle",
    category: "Subscriptions",
    amounts: [104, 104, 104, 104, 118, 118, 118, 118, 118, 118, 118, 118],
    startOffset: 0,
    day: 12,
    paymentMethod: "Apple Card",
    recurring: true,
    frequency: "monthly",
  });

  addSeries({
    idPrefix: "savings",
    name: "Automatic Savings Transfer",
    category: "Savings",
    amounts: [700, 700, 750, 750, 760, 780, 780, 800, 820, 820, 830, 850],
    startOffset: 0,
    day: 15,
    paymentMethod: "ACH Transfer",
    recurring: true,
    frequency: "monthly",
  });

  addSeries({
    idPrefix: "fitness",
    name: "Wellness & Fitness",
    category: "Healthcare",
    amounts: [128, 128, 128, 128, 142, 142, 156, 156, 156, 156, 171, 171],
    startOffset: 0,
    day: 2,
    paymentMethod: "Visa Sapphire",
    recurring: true,
    frequency: "monthly",
  });

  addSeries({
    idPrefix: "entertainment",
    name: "Leisure & Streaming",
    category: "Entertainment",
    amounts: [162, 148, 172, 160, 158, 174, 168, 171, 165, 177, 169, 163],
    startOffset: 0,
    day: 20,
    paymentMethod: "Apple Card",
  });

  addSeries({
    idPrefix: "fuel",
    name: "Electric Vehicle Charging",
    category: "Transportation",
    amounts: [58, 62, 51, 56, 49, 60, 52, 54, 57, 55, 63, 58],
    startOffset: 0,
    day: 11,
    paymentMethod: "Visa Sapphire",
    note: "Fast-charging sessions and garage electricity.",
  });

  // Irregular and seasonal expenses
  items.push(
    {
      id: "travel-escape",
      name: "Spring Weekend Getaway",
      category: "Travel",
      amount: 780,
      date: makeDate(-2, 24),
      paymentMethod: "Amex Platinum",
      note: "Flight and boutique hotel in Austin.",
    },
    {
      id: "travel-conference",
      name: "Product Summit Conference",
      category: "Travel",
      amount: 1340,
      date: makeDate(-5, 6),
      paymentMethod: "Amex Platinum",
      note: "Flight, lodging, and meals for San Francisco conference.",
    },
    {
      id: "health-dental",
      name: "Dental Cleaning & X-Rays",
      category: "Healthcare",
      amount: 220,
      date: makeDate(-1, 10),
      paymentMethod: "HSA Card",
    },
    {
      id: "misc-gifts",
      name: "Family Birthday Gifts",
      category: "Miscellaneous",
      amount: 186,
      date: makeDate(-3, 4),
      paymentMethod: "Visa Sapphire",
    },
    {
      id: "misc-home",
      name: "Home Office Upgrade",
      category: "Miscellaneous",
      amount: 420,
      date: makeDate(-4, 14),
      paymentMethod: "Visa Sapphire",
      note: "Standing desk accessories and lighting.",
    },
    {
      id: "ent-music",
      name: "Concert Tickets",
      category: "Entertainment",
      amount: 245,
      date: makeDate(-6, 19),
      paymentMethod: "Visa Sapphire",
    },
    {
      id: "dining-chef",
      name: "Chef's Tasting Menu",
      category: "Dining",
      amount: 210,
      date: makeDate(-7, 27),
      paymentMethod: "Amex Platinum",
    },
    {
      id: "savings-invest",
      name: "Brokerage Investment",
      category: "Savings",
      amount: 1200,
      date: makeDate(-8, 3),
      paymentMethod: "ACH Transfer",
    },
    {
      id: "travel-passport",
      name: "Passport Renewal & Photos",
      category: "Travel",
      amount: 210,
      date: makeDate(-9, 7),
      paymentMethod: "Visa Sapphire",
    },
    {
      id: "utilities-annual",
      name: "Annual Internet Prepay",
      category: "Utilities",
      amount: 480,
      date: makeDate(-10, 2),
      paymentMethod: "Visa Sapphire",
      note: "Annual fiber internet renewal.",
    },
    {
      id: "health-therapy",
      name: "Quarterly Therapy Session",
      category: "Healthcare",
      amount: 260,
      date: makeDate(-4, 28),
      paymentMethod: "HSA Card",
    },
    {
      id: "ent-retreat",
      name: "Outdoor Adventure Retreat",
      category: "Entertainment",
      amount: 520,
      date: makeDate(-11, 16),
      paymentMethod: "Visa Sapphire",
    }
  );

  // Upcoming known bills (next due instances)
  items.push(
    {
      id: "gym-membership",
      name: "Studio Fitness Membership",
      category: "Healthcare",
      amount: 98,
      date: makeDate(0, 26),
      paymentMethod: "Visa Sapphire",
      recurring: true,
      frequency: "monthly",
      note: "Due later this month.",
    },
    {
      id: "travel-flight",
      name: "Holiday Flight Reservation",
      category: "Travel",
      amount: 640,
      date: makeDate(1, 8),
      paymentMethod: "Amex Platinum",
      note: "Upcoming trip to visit family.",
    }
  );

  return items.sort((a, b) =>
    parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
};

export const expenses: Expense[] = buildExpenses();

const addFrequency = (date: Date, frequency: Frequency = "monthly") => {
  switch (frequency) {
    case "quarterly":
      return addMonths(date, 3);
    case "yearly":
      return addMonths(date, 12);
    default:
      return addMonths(date, 1);
  }
};

export const getMonthlyTotals = (list: Expense[], monthsBack = 11) => {
  const end = startOfMonth(now);
  const start = startOfMonth(subMonths(end, monthsBack));
  const months = eachMonthOfInterval({ start, end });

  return months.map((month) => {
    const total = list
      .filter((expense) => isSameMonth(parseISO(expense.date), month))
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      label: format(month, "MMM"),
      month,
      total,
    };
  });
};

export const getCategoryTotals = (list: Expense[]) => {
  return BASE_CATEGORIES.map((category) => {
    const total = list
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category,
      total,
      color: CATEGORY_COLORS[category],
    };
  }).filter((item) => item.total > 0);
};

export const getCurrentMonthTotals = (list: Expense[]) => {
  const monthStart = startOfMonth(now);
  return list.filter((expense) =>
    isSameMonth(parseISO(expense.date), monthStart)
  );
};

export const getCategoryBudgetProgress = (list: Expense[]) => {
  const currentMonthExpenses = getCurrentMonthTotals(list);
  const categoryTotals = BASE_CATEGORIES.map((category) => {
    const spent = currentMonthExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category,
      spent,
      budget: CATEGORY_BUDGETS[category],
      color: CATEGORY_COLORS[category],
    };
  });

  return categoryTotals
    .filter((item) => item.budget > 0)
    .sort((a, b) => b.spent / b.budget - a.spent / a.budget);
};

export const getUpcomingBills = (list: Expense[], limit = 4) => {
  const today = now;

  const recurringItems = list.filter((expense) => expense.recurring);

  const upcoming = recurringItems
    .map((expense) => {
      let nextDue = addFrequency(parseISO(expense.date), expense.frequency);
      while (isBefore(nextDue, today)) {
        nextDue = addFrequency(nextDue, expense.frequency);
      }

      return {
        ...expense,
        dueDate: nextDue,
      };
    })
    .filter((item) => isAfter(item.dueDate, today))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return upcoming.slice(0, limit);
};

export const getTotalSpent = (list: Expense[]) =>
  list.reduce((sum, expense) => sum + expense.amount, 0);

export const getMonthOptions = (list: Expense[]) => {
  const totals = getMonthlyTotals(list, 11);
  return totals
    .map((item) => ({
      label: `${format(item.month, "MMMM yyyy")}`,
      value: format(item.month, "yyyy-MM"),
    }))
    .reverse();
};

export const getCategoryOptions = () =>
  BASE_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  }));

export const categoryColors = CATEGORY_COLORS;
export const categoryBudgets = CATEGORY_BUDGETS;
export const categories = BASE_CATEGORIES;
