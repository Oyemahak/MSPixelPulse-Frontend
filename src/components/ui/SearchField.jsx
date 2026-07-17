import { useId } from "react";
import { LuSearch, LuX } from "react-icons/lu";

export default function SearchField({
  value,
  onValueChange,
  label = "Search",
  placeholder = "Search",
  className = "",
  autoComplete = "off",
}) {
  const inputId = useId();
  const hasValue = Boolean(String(value || "").trim());

  return (
    <div className={`search-field ${className}`.trim()}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <LuSearch className="search-field-icon" aria-hidden="true" />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {hasValue && (
        <button
          type="button"
          className="search-field-clear"
          onClick={() => onValueChange("")}
          aria-label={`Clear ${label.toLowerCase()}`}
          title="Clear search"
        >
          <LuX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
