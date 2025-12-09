'use client';

type SelectOption = {
  label: string;
  value: string;
};

type FilterProps = {
  monthOptions: SelectOption[];
  categoryOptions: SelectOption[];
  selectedMonth: string;
  selectedCategory: string;
  onMonthChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
};

export function FiltersBar({
  monthOptions,
  categoryOptions,
  selectedMonth,
  selectedCategory,
  onMonthChange,
  onCategoryChange,
  onReset,
}: FilterProps) {
  return (
    <div className="filters">
      <label>
        Month
        <select
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
        >
          <option value="all">All months</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Category
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button onClick={onReset}>Reset filters</button>
    </div>
  );
}
