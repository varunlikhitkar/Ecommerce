import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  to,
  type,
  ...props
}) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type || 'button'} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
