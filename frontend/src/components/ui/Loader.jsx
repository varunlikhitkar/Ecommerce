import React from 'react';

const Loader = ({ label = 'Loading', className = '' }) => {
  return (
    <div className={`loader ${className}`.trim()} role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <span className="loader-text">{label}...</span>
    </div>
  );
};

export default Loader;
