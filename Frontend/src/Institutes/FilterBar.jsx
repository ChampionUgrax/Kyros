
import { useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Filter,
} from "lucide-react";

/**
 * FilterBar
 *
 * Props:
 * search, onSearchChange
 * searchPlaceholder
 * filters: [{ key, label, options, value, onChange, placeholder }]
 * onReset
 * actions: optional JSX
 * resultCount, resultLabel
 * showResultCount
 * className
 */

export default function FilterBar({
  search = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  filters = [],
  onReset,
  actions,
  resultCount,
  resultLabel = "records found",
  showResultCount = true,
  className = "",
}) {
  const activeFilters = useMemo(
    () =>
      filters.filter(
        (filter) =>
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== "" &&
          filter.value !== "All"
      ),
    [filters]
  );

  const hasSearch = Boolean(search.trim());
  const hasActiveFilters = hasSearch || activeFilters.length > 0;

  const clearAll = () => {
    onSearchChange?.("");
    filters.forEach((filter) => {
      filter.onChange?.(filter.defaultValue ?? "All");
    });
    onReset?.();
  };

  const removeFilter = (filter) => {
    filter.onChange?.(filter.defaultValue ?? "All");
  };

  return (
    <section className={`institute-filter-bar ${className}`}>
      <div className="institute-filter-bar-main">
        <label className="institute-filter-search">
          <Search size={16} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search records"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </label>

        {filters.length > 0 && (
          <div className="institute-filter-controls">
            {filters.map((filter) => (
              <label
                className="institute-filter-select-wrap"
                key={filter.key}
              >
                {filter.icon && <filter.icon size={14} />}

                <select
                  value={filter.value ?? filter.defaultValue ?? "All"}
                  onChange={(event) =>
                    filter.onChange?.(event.target.value)
                  }
                  aria-label={filter.label}
                >
                  <option value={filter.defaultValue ?? "All"}>
                    {filter.placeholder || `All ${filter.label}`}
                  </option>

                  {filter.options?.map((option) => {
                    const item =
                      typeof option === "string"
                        ? { label: option, value: option }
                        : option;

                    return (
                      <option
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </option>
                    );
                  })}
                </select>
              </label>
            ))}
          </div>
        )}

        <div className="institute-filter-bar-actions">
          {actions}

          {hasActiveFilters && (
            <button
              type="button"
              className="institute-filter-reset"
              onClick={clearAll}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {(showResultCount || activeFilters.length > 0) && (
        <div className="institute-filter-bar-bottom">
          <div className="institute-filter-active">
            <span className="institute-filter-active-icon">
              <SlidersHorizontal size={13} />
            </span>

            {showResultCount && (
              <span className="institute-filter-result-count">
                <strong>{resultCount ?? 0}</strong> {resultLabel}
              </span>
            )}

            {hasActiveFilters && (
              <span className="institute-filter-applied-label">
                Filters applied
              </span>
            )}
          </div>

          {activeFilters.length > 0 && (
            <div className="institute-filter-chips">
              {activeFilters.map((filter) => {
                const selectedOption = filter.options?.find((option) => {
                  const item =
                    typeof option === "string"
                      ? { label: option, value: option }
                      : option;

                  return item.value === filter.value;
                });

                const selectedLabel =
                  typeof selectedOption === "string"
                    ? selectedOption
                    : selectedOption?.label ?? filter.value;

                return (
                  <button
                    type="button"
                    className="institute-filter-chip"
                    key={filter.key}
                    onClick={() => removeFilter(filter)}
                    title={`Remove ${filter.label} filter`}
                  >
                    {filter.label}: {selectedLabel}
                    <X size={11} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
