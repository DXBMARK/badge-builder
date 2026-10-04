/*
 * Project: Badge Builder Pro
 * Purpose: Single source of truth for copy/paste snippets (Markdown, HTML).
 */

const hex = (c, fallback) => String(c || fallback).replace('#', '').slice(0, 8);
const esc = (t) => encodeURIComponent(String(t).replace(/-/g, '--').replace(/_/g, '__'));

/** Shields.io equivalent of the designed badge (label, message and both colours). */
export const createMarkdownSnippet = (config) => {
  const label = config.leftText || 'Badge';
  const value = config.rightText || 'Value';
  return `![${label}](https://img.shields.io/badge/${esc(config.leftText || '')}-${esc(value)}-${hex(config.rightBg, 'F97E1A')}?labelColor=${hex(config.leftBg, '0F172A')})`;
};

/** <img> tag with the exact SVG embedded as a base64 data URI. */
export const createHtmlSnippet = (svg, config) => {
  const label = (config.leftText || 'Badge').replace(/"/g, '&quot;');
  const bytes = new TextEncoder().encode(svg);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return `<img src="data:image/svg+xml;base64,${btoa(binString)}" alt="${label}" />`;
};
