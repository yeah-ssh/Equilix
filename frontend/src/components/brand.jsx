import React from 'react';
import { Link } from 'react-router-dom';

// A sun on the horizon: the "overcoming the darkness" idea, small enough for a favicon.
export const BrandMark = ({ className = 'brand-mark' }) => (
  <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M7 19a9 9 0 0 1 18 0z" fill="var(--firstlight)" />
    <rect x="5" y="20.5" width="22" height="2.5" rx="1.25" fill="var(--seaglass)" />
  </svg>
);

const Brand = ({ to = '/' }) => (
  <Link to={to} className="brand" aria-label="Equilix home">
    <BrandMark />
    <span>Equilix</span>
  </Link>
);

export default Brand;
