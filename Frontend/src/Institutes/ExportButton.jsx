
import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  ChevronDown,
  Check,
  LoaderCircle,
} from "lucide-react";

function getNestedValue(object, accessor) {
  if (!accessor) return "";

  return accessor
    .split(".")
    .reduce((current, key) => current?.[key], object);
}

function formatCellValue(value) {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

// Protect spreadsheet users from formula injection.
function protectSpreadsheetValue(value) {
  const text = formatCellValue(value);

  if (/^[\s]*[=+\-@]/.test(text)) {
    return `'${text}`;
  }

  return text;
}

function escapeCSV(value) {
  const text = protectSpreadsheetValue(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function prepareColumns(columns, data) {
  if (columns?.length) {
    return columns.map((column) => ({
      header: column.header || column.label || column.accessor,
      accessor: column.accessor,
      exportValue: column.exportValue,
      format: column.format,
    }));
  }

  if (!data.length || typeof data[0] !== "object") {
    return [];
  }

  return Object.keys(data[0]).map((key) => ({
    header: key,
    accessor: key,
  }));
}

function getExportValue(row, column) {
  const value = column.accessor
    ? getNestedValue(row, column.accessor)
    : "";

  if (column.exportValue) {
    return column.exportValue(value, row);
  }

  if (column.format) {
    return column.format(value, row);
  }

  return value;
}

export default function ExportButton({
  data = [],
  selectedData = [],
  columns = [],
  filename = "kyros-export",
  formats = ["csv", "json"],
  includeHeaders = true,
  disabled = false,
  label = "Export",
  selectedLabel = "Export selected",
  showSelectedOption = true,
  onExport,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const exportRecords = async (format, useSelected = false) => {
    const records = useSelected ? selectedData : data;

    if (!records.length || exporting) return;

    setExporting(true);

    try {
      const exportColumns = prepareColumns(columns, records);
      const safeFilename = filename.replace(/\.[^/.]+$/, "");

      if (format === "csv") {
        const rows = records.map((row) =>
          exportColumns.map((column) =>
            escapeCSV(getExportValue(row, column))
          )
        );

        const headerRow = exportColumns.map((column) =>
          escapeCSV(column.header)
        );

        const csvContent = [
          ...(includeHeaders ? [headerRow.join(",")] : []),
          ...rows.map((row) => row.join(",")),
        ].join("\r\n");

        // UTF-8 BOM improves compatibility with Excel.
        downloadFile(
          "\uFEFF" + csvContent,
          `${safeFilename}${useSelected ? "-selected" : ""}.csv`,
          "text/csv;charset=utf-8;"
        );
      } else if (format === "json") {
        const jsonContent = JSON.stringify(records, null, 2);

        downloadFile(
          jsonContent,
          `${safeFilename}${useSelected ? "-selected" : ""}.json`,
          "application/json;charset=utf-8;"
        );
      }

      setLastExport(format);
      setOpen(false);
      onExport?.({
        format,
        records,
        scope: useSelected ? "selected" : "all",
      });
    } catch (error) {
      console.error("Export failed:", error);
      window.alert("Unable to export this file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const formatOptions = [
    {
      id: "csv",
      label: "Export as CSV",
      description: "Excel and Google Sheets",
      icon: FileSpreadsheet,
    },
    {
      id: "json",
      label: "Export as JSON",
      description: "Structured data file",
      icon: FileJson,
    },
  ].filter((option) => formats.includes(option.id));

  const hasSelectedData = selectedData.length > 0;
  const isDisabled = disabled || exporting || data.length === 0;

  return (
    <div
      className={`institute-export ${className}`}
      ref={menuRef}
    >
      <button
        type="button"
        className="institute-export-trigger"
        disabled={isDisabled}
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {exporting ? (
          <LoaderCircle
            size={15}
            className="institute-export-spinner"
          />
        ) : (
          <Download size={15} />
        )}

        {exporting ? "Exporting..." : label}

        <ChevronDown
          size={14}
          className={open ? "rotated" : ""}
        />
      </button>

      {open && (
        <div className="institute-export-menu" role="menu">
          {showSelectedOption && hasSelectedData && (
            <>
              <div className="institute-export-menu-heading">
                SELECTED RECORDS ({selectedData.length})
              </div>

              {formatOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    type="button"
                    role="menuitem"
                    key={`selected-${option.id}`}
                    onClick={() => exportRecords(option.id, true)}
                    disabled={exporting}
                  >
                    <span className="institute-export-option-icon">
                      <Icon size={17} />
                    </span>
                    <span className="institute-export-option-text">
                      <strong>
                        {option.id === "csv"
                          ? "Selected as CSV"
                          : "Selected as JSON"}
                      </strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}

              <div className="institute-export-divider" />
            </>
          )}

          <div className="institute-export-menu-heading">
            ALL RECORDS ({data.length})
          </div>

          {formatOptions.map((option) => {
            const Icon = option.icon;

            return (
              <button
                type="button"
                role="menuitem"
                key={option.id}
                onClick={() => exportRecords(option.id, false)}
                disabled={exporting}
              >
                <span className="institute-export-option-icon">
                  <Icon size={17} />
                </span>
                <span className="institute-export-option-text">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {lastExport === option.id && (
                  <Check
                    size={14}
                    className="institute-export-check"
                  />
                )}
              </button>
            );
          })}

          {!formatOptions.length && (
            <p className="institute-export-empty">
              No export formats are enabled.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
