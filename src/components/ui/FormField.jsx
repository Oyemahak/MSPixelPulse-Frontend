import { useId } from "react";

export function FloatingField({
  as = "input",
  id,
  label,
  optional = false,
  error,
  hint,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const describedBy = [props["aria-describedby"], hintId, errorId]
    .filter(Boolean)
    .join(" ") || undefined;
  const Control = as;

  return (
    <div className={`form-field ${className}`.trim()}>
      <div className="floating-field">
        <Control
          {...props}
          id={fieldId}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`floating-control ${props.className || ""}`.trim()}
        />
        <label htmlFor={fieldId}>
          {label}
          {optional && <span> (optional)</span>}
        </label>
      </div>
      {hint && <p id={hintId} className="form-hint">{hint}</p>}
      {error && <p id={errorId} className="form-error">{error}</p>}
    </div>
  );
}

export function StandardField({
  id,
  label,
  optional = false,
  hint,
  error,
  children,
  className = "",
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  return (
    <div className={`form-field standard-field ${className}`.trim()}>
      <label htmlFor={fieldId}>
        {label}
        {optional && <span> (optional)</span>}
      </label>
      {children(fieldId, {
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined,
      })}
      {hint && <p id={`${fieldId}-hint`} className="form-hint">{hint}</p>}
      {error && <p id={`${fieldId}-error`} className="form-error">{error}</p>}
    </div>
  );
}
