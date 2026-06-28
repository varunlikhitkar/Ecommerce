import React from 'react';

const Input = ({
  label,
  id,
  error,
  helperText,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${inputClassName}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {helperText && !error && <span className="form-helper">{helperText}</span>}
      {error && (
        <span className="form-error" id={`${inputId}-error`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
