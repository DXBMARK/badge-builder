/*
 * Project: Badge Builder Pro
 * Purpose: Central SVG / config sanitisation (XSS hardening)
 */
import DOMPurify from 'dompurify';

const SVG_FORBID_TAGS = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'style', 'animate', 'set', 'animateTransform', 'animateMotion'];

/**
 * Sanitises an SVG fragment (the inner markup of an <svg>) so it is safe to
 * inject into the page: no scripts, no event handlers, no foreignObject and
 * no javascript: URLs.
 * @param {string} markup
 * @returns {string}
 */
export const sanitizeSvgFragment = (markup = '') => {
  if (!markup || typeof markup !== 'string') return '';
  const clean = DOMPurify.sanitize(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: SVG_FORBID_TAGS,
    FORBID_ATTR: ['style'],
    RETURN_DOM: true,
  });
  const svg = clean && clean.querySelector ? clean.querySelector('svg') : null;
  return svg ? svg.innerHTML : '';
};

/** Only allow raster data URIs or https images for custom icons. */
export const isSafeImageUrl = (url = '') =>
  typeof url === 'string' &&
  (/^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i.test(url) || /^https:\/\//i.test(url));

/**
 * Validates a config object that came from an untrusted source (URL hash,
 * imported workspace file). Only keys that exist in the default config are
 * kept, and only primitive values of the same type are accepted.
 * @param {unknown} input
 * @param {Record<string, unknown>} defaults
 */
export const sanitizeConfig = (input, defaults) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const out = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (!(key in input)) continue;
    const v = input[key];
    const t = typeof defaults[key];
    if (t === 'number' && typeof v === 'number' && Number.isFinite(v)) out[key] = v;
    else if (t === 'boolean' && typeof v === 'boolean') out[key] = v;
    else if (t === 'string' && typeof v === 'string' && v.length <= 200000) out[key] = v;
  }
  if (typeof out.customSvgContent === 'string') out.customSvgContent = sanitizeSvgFragment(out.customSvgContent);
  if (out.customIconUrl && !isSafeImageUrl(out.customIconUrl)) out.customIconUrl = '';
  return out;
};
