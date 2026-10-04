/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Icon Component
 * Notes: Follow TS conventions.
 */

import { UI_ICONS } from '../../constants/icons';

/**
 * [TS] Renders a functional UI icon.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const Icon = ({ name, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={UI_ICONS[name]} />
  </svg>
);

export default Icon;
