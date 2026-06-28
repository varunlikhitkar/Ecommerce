import React from 'react';

const Skeleton = ({ className = '', style }) => {
  return <div className={`skeleton ${className}`.trim()} style={style} />;
};

export default Skeleton;
