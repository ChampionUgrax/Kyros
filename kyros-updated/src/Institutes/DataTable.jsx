
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
  Inbox,
  LoaderCircle,
  MoreHorizontal,
  X,
} from "lucide-react";

export default function DataTable({
  columns = [],
  data = [],
  rowKey = "id",
  title,
  description,
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKeys = [],
  selectable = false,
  onSelectionChange,
  onRowClick,
  rowActions,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to display right now.",
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  pagination = true,
  toolbar,
  headerActions,
  className = "",
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openActionRow, setOpenActionRow] = useState(null);

  const getRowId = (row) => row?.[rowKey];

  const searchableFields = useMemo(() => {
    if (searchKeys.length) return searchKeys;
    return columns
      .filter((column) => column.searchable !== false)
      .map((column) => column.accessor)
      .filter(Boolean);
  }, [columns, searchKeys]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((row) =>
      searchableFields.some((field) => {
        const value = field
          .split(".")
          .reduce((current, key) => current?.[key], row);

        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [data, search, searchableFields]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const column = columns.find(
      (item) => item.accessor === sortConfig.key
    );

    return [...filteredData].sort((a, b) => {
      const getValue = (row) =>
        sortConfig.key
          .split(".")
          .reduce((current, key) => current?.[key], row);

      const first = getValue(a);
      const second = getValue(b);

      let comparison = 0;

      if (column?.sortValue) {
        comparison = column.sortValue(a, b);
      } else if (
        typeof first === "number" &&
        typeof second === "number"
      ) {
        comparison = first - second;
      } else {
        comparison = String(first ?? "").localeCompare(
          String(second ?? ""),
          undefined,
          { numeric: true, sensitivity: "base" }
        );
      }

      return sortConfig.direction === "asc"
        ? comparison
        : -comparison;
    });
  }, [filteredData, sortConfig, columns]);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(sortedData.length / rowsPerPage))
    : 1;

  const safePage = Math.min(currentPage, totalPages);

  const visibleData = pagination
    ? sortedData.slice(
        (safePage - 1) * rowsPerPage,
        safePage * rowsPerPage
      )
    : sortedData;

  const visibleIds = visibleData
    .map(getRowId)
    .filter((id) => id !== undefined && id !== null);

  const selectedVisibleCount = visibleIds.filter((id) =>
    selectedRows.includes(id)
  ).length;

  const allVisibleSelected =
    visibleIds.length > 0 &&
    selectedVisibleCount === visibleIds.length;

  const someVisibleSelected = selectedVisibleCount > 0;

  useEffect(() => {
    onSelectionChange?.(
      data.filter((row) => selectedRows.includes(getRowId(row)))
    );
  }, [selectedRows, data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".institute-datatable-actions")) {
        setOpenActionRow(null);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleSort = (accessor) => {
    setSortConfig((previous) => ({
      key: accessor,
      direction:
        previous.key === accessor && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const toggleRow = (id) => {
    setSelectedRows((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleAllVisible = () => {
    setSelectedRows((previous) => {
      if (allVisibleSelected) {
        return previous.filter((id) => !visibleIds.includes(id));
      }

      return [
        ...new Set([...previous, ...visibleIds]),
      ];
    });
  };

  const clearSelection = () => setSelectedRows([]);

  const getSortIcon = (accessor) => {
    if (sortConfig.key !== accessor) {
      return <ChevronsUpDown size={13} />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp size={13} />
    ) : (
      <ChevronDown size={13} />
    );
  };

  const startRecord =
    sortedData.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;

  const endRecord = Math.min(
    safePage * rowsPerPage,
    sortedData.length
  );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - safePage) <= 1
  );

  return (
    <section className={`institute-datatable ${className}`}>
      {(title || description || searchable || headerActions || toolbar) && (
        <div className="institute-datatable-toolbar">
          <div className="institute-datatable-heading">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>

          <div className="institute-datatable-toolbar-actions">
            {toolbar}

            {searchable && (
              <label className="institute-datatable-search">
                <Search size={16} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            )}

            {headerActions}
          </div>
        </div>
      )}

      {selectable && selectedRows.length > 0 && (
        <div className="institute-datatable-selection-bar">
          <span>
            {selectedRows.length} record
            {selectedRows.length !== 1 ? "s" : ""} selected
          </span>
          <button type="button" onClick={clearSelection}>
            Clear selection
            <X size={14} />
          </button>
        </div>
      )}

      <div className="institute-datatable-scroll">
        <table className="institute-datatable-table">
          <thead>
            <tr>
              {selectable && (
                <th className="institute-datatable-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate =
                          someVisibleSelected && !allVisibleSelected;
                      }
                    }}
                    onChange={toggleAllVisible}
                    aria-label="Select all visible rows"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key || column.accessor || column.header}
                  className={column.headerClassName || ""}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.sortable && column.accessor ? (
                    <button
                      type="button"
                      className="institute-datatable-sort"
                      onClick={() => handleSort(column.accessor)}
                    >
                      {column.header}
                      {getSortIcon(column.accessor)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}

              {rowActions && (
                <th className="institute-datatable-action-heading">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (rowActions ? 1 : 0)
                  }
                >
                  <div className="institute-datatable-state">
                    <LoaderCircle className="institute-datatable-spinner" size={26} />
                    <strong>Loading records...</strong>
                    <span>Please wait a moment.</span>
                  </div>
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (rowActions ? 1 : 0)
                  }
                >
                  <div className="institute-datatable-state">
                    <span className="institute-datatable-empty-icon">
                      <Inbox size={25} />
                    </span>
                    <strong>{emptyTitle}</strong>
                    <span>
                      {search
                        ? "Try changing your search keywords."
                        : emptyDescription}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => {
                const id = getRowId(row);
                const isSelected = selectedRows.includes(id);

                return (
                  <tr
                    key={id ?? rowIndex}
                    className={`${isSelected ? "selected" : ""} ${
                      onRowClick ? "clickable" : ""
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td
                        className="institute-datatable-checkbox-cell"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}

                    {columns.map((column) => {
                      const value = column.accessor
                        ? column.accessor
                            .split(".")
                            .reduce(
                              (current, key) => current?.[key],
                              row
                            )
                        : undefined;

                      return (
                        <td
                          key={column.key || column.accessor || column.header}
                          className={column.cellClassName || ""}
                          style={{
                            textAlign: column.align || "left",
                          }}
                        >
                          {column.render
                            ? column.render(value, row, rowIndex)
                            : column.format
                              ? column.format(value, row)
                              : value ?? "—"}
                        </td>
                      );
                    })}

                    {rowActions && (
                      <td
                        className="institute-datatable-actions"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="institute-datatable-action-trigger"
                          onClick={() =>
                            setOpenActionRow((previous) =>
                              previous === id ? null : id
                            )
                          }
                          aria-label="Open row actions"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openActionRow === id && (
                          <div className="institute-datatable-action-menu">
                            {rowActions(row).map((action, index) => {
                              const ActionIcon = action.icon;

                              return (
                                <button
                                  type="button"
                                  key={action.label || index}
                                  className={action.danger ? "danger" : ""}
                                  disabled={action.disabled}
                                  onClick={() => {
                                    setOpenActionRow(null);
                                    action.onClick?.(row);
                                  }}
                                >
                                  {ActionIcon && <ActionIcon size={14} />}
                                  {action.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && !loading && sortedData.length > 0 && (
        <div className="institute-datatable-pagination">
          <div className="institute-datatable-pagination-info">
            Showing <strong>{startRecord}-{endRecord}</strong> of{" "}
            <strong>{sortedData.length}</strong> records
          </div>

          <div className="institute-datatable-pagination-controls">
            <label>
              Rows:
              <select
                value={rowsPerPage}
                onChange={(event) =>
                  setRowsPerPage(Number(event.target.value))
                }
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers.map((page, index) => {
              const previousPage = pageNumbers[index - 1];
              const showGap = previousPage && page - previousPage > 1;

              return (
                <span key={page} className="institute-datatable-page-group">
                  {showGap && <span className="institute-datatable-ellipsis">...</span>}
                  <button
                    type="button"
                    className={safePage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
