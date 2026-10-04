/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: SVG Generation Logic
 * Notes: Follow TS conventions. Added Smart Alignment and Auto Width.
 */

import { escapeXml, sanitize } from './sanitize';
import { sanitizeSvgFragment, isSafeImageUrl } from './safeSvg';
import { ICON_LIBRARY, LEGACY_ICON_MAP } from '../constants/icons';

/**
 * [TS] Builds the SVG string based on the provided configuration.
 * @param {Object} config
 * @returns {Object} { svg, width, height }
 */
const BUILD_DEFAULTS = {
  width: 140, height: 32, leftWidth: 70, borderRadius: 6,
  leftBg: '#334155', rightBg: '#F97E1A', useGradient: false,
  leftText: 'Badge', rightText: 'Value',
  leftFontSize: 13, rightFontSize: 13, leftFontWeight: '700', rightFontWeight: '700',
  fontFamily: 'Inter, sans-serif', iconType: 'none', iconMode: 'preset', iconScale: 1,
  autoWidth: true, smartAlign: true,
};


let measureCtx;
const measureText = (text, size, weight, family) => {
  const str = text || '';
  const w = Number(weight) || (weight === 'bold' ? 700 : 400);
  const factor = w >= 800 ? 0.62 : w >= 600 ? 0.58 : 0.55;
  const estimate = str.length * size * factor;
  try {
    if (typeof document !== 'undefined') {
      measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
      if (measureCtx) {
        measureCtx.font = `${w} ${size}px ${family || 'sans-serif'}`;
        // Never go below 92% of the estimate: the web font may not be loaded yet.
        return Math.max(measureCtx.measureText(str).width * 1.04, estimate * 0.92);
      }
    }
  } catch { /* fall through to estimate */ }
  return estimate;
};

/** Black or white, whichever reads better on the given hex background. */
const contrastText = (hex) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return '#FFFFFF';
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#0F172A' : '#FFFFFF';
};

export const buildSVG = (input) => {
  // Presets, packs and bulk rows may be partial: fill gaps so no value turns into NaN.
  const defined = Object.fromEntries(Object.entries(input || {}).filter(([, v]) => v !== undefined && v !== null));
  const config = { ...BUILD_DEFAULTS, ...defined };
  if (defined.leftTextColor === undefined) config.leftTextColor = contrastText(config.leftBg);
  if (defined.rightTextColor === undefined) config.rightTextColor = contrastText(config.rightBg);
  const {
    width, height, leftWidth, borderRadius, leftBg, rightBg, 
    useGradient, gradStart, gradEnd, leftText, rightText,
    leftTextColor, rightTextColor, leftFontSize, rightFontSize,
    leftFontWeight, rightFontWeight, fontFamily,
    leftAlign, leftAlignY, rightAlign, rightAlignY, 
    iconType, iconScale, iconX, iconY, outlineWidth, outlineColor,
    iconMode, customIconUrl, customSvgContent, autoWidth, smartAlign
  } = config;

  let safeHeight = sanitize(height, 16, 500);

  // Auto Width Calculation
  const hasIcon = (iconMode === 'preset' && iconType !== 'none') || (iconMode === 'custom' && customIconUrl) || (iconMode === 'custom-svg' && customSvgContent);
  const iconW = hasIcon ? (14 * sanitize(iconScale, 0.1, 5)) : 0;
  const gap = hasIcon && leftText ? 6 : 0;
  
  // Text width: measure with the browser when possible (accurate for the loaded font),
  // otherwise fall back to a weight-aware estimate. Padding keeps text off the edges.
  const calcTextWidth = (text, size, weight) => measureText(text, size, weight, fontFamily);

  const lTextW = calcTextWidth(leftText, leftFontSize, leftFontWeight);
  const rTextW = calcTextWidth(rightText, rightFontSize, rightFontWeight);

  let safeLeftWidth = sanitize(leftWidth, 0, 2000);
  let safeWidth = sanitize(width, 40, 2000);
  let rightW = Math.max(0, safeWidth - safeLeftWidth);

  if (autoWidth !== false) {
    safeLeftWidth = Math.max(10, iconW + gap + lTextW + 24); // 12px padding each side
    rightW = Math.max(10, rTextW + 24);
    safeWidth = safeLeftWidth + rightW;
  }

  const r = sanitize(borderRadius, 0, safeHeight / 2);
  const scaleY = sanitize(iconScale, 0.1, 5);

  // Smart Alignment Calculation
  let iX = 0, iY = 0, lTextX, lTextY, rTextX, rTextY;

  if (smartAlign !== false) {
    // Center block in Left
    const blockWidth = iconW + gap + lTextW;
    const startX = (safeLeftWidth - blockWidth) / 2;
    
    iX = startX + (hasIcon ? Number(leftAlign || 0) : 0);
    iY = (safeHeight / 2) - (12 * scaleY) + Number(leftAlignY || 0);
    
    lTextX = startX + iconW + gap + (lTextW / 2) + Number(leftAlign || 0);
    lTextY = (safeHeight / 2) + (leftFontSize / 2) - (leftFontSize * 0.12) + Number(leftAlignY || 0);

    // Center Right
    rTextX = safeLeftWidth + (rightW / 2) + Number(rightAlign || 0);
    rTextY = (safeHeight / 2) + (rightFontSize / 2) - (rightFontSize * 0.12) + Number(rightAlignY || 0);
  } else {
    // Legacy Manual Positioning
    iX = sanitize(iconX, -500, 500);
    iY = iconY !== undefined ? sanitize(iconY, -500, 500) : (safeHeight / 2) - (12 * scaleY);
    
    lTextX = (safeLeftWidth / 2) + (hasIcon ? 10 : 0) + Number(leftAlign || 0);
    lTextY = (safeHeight / 2) + (leftFontSize / 2) - (leftFontSize * 0.12) + Number(leftAlignY || 0);
    
    rTextX = safeLeftWidth + (rightW / 2) + Number(rightAlign || 0);
    rTextY = (safeHeight / 2) + (rightFontSize / 2) - (rightFontSize * 0.12) + Number(rightAlignY || 0);
  }

  const renderIcon = () => {
    if (iconMode === 'custom-svg' && customSvgContent) {
      return `<g data-drag="icon" style="cursor: grab;" transform="translate(${iX}, ${iY}) scale(${scaleY})" fill="${escapeXml(leftTextColor)}">${sanitizeSvgFragment(customSvgContent)}</g>`;
    }
    if (iconMode === 'custom' && customIconUrl && isSafeImageUrl(customIconUrl)) {
      return `<image data-drag="icon" style="cursor: grab;" href="${escapeXml(customIconUrl)}" x="${iX}" y="${iY}" height="${24 * scaleY}" width="${24 * scaleY}" />`;
    }
    if (iconMode === 'preset' && iconType !== 'none') {
      let iconSvg = '';
      if (ICON_LIBRARY[iconType]) {
        iconSvg = ICON_LIBRARY[iconType].svg;
      } else if (LEGACY_ICON_MAP[iconType]) {
        iconSvg = LEGACY_ICON_MAP[iconType];
      }
      
      if (iconSvg) {
        const innerContent = iconSvg.replace(/<svg[^>]*>|<\/svg>/g, '');
        return `<g data-drag="icon" style="cursor: grab;" transform="translate(${iX}, ${iY}) scale(${scaleY})" fill="${escapeXml(leftTextColor)}">${innerContent}</g>`;
      }
    }
    return '';
  };

  const rnd = (n) => Math.round(n * 100) / 100;
  safeWidth = rnd(safeWidth);
  rightW = rnd(rightW);
  safeLeftWidth = rnd(safeLeftWidth);
  iX = rnd(iX); iY = rnd(iY);
  lTextX = rnd(lTextX); lTextY = rnd(lTextY); rTextX = rnd(rTextX); rTextY = rnd(rTextY);

  const svgString = `
<svg width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="round-corner"><rect width="${safeWidth}" height="${safeHeight}" rx="${r}" /></clipPath>
    ${useGradient ? `
    <linearGradient id="grad-fin" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${escapeXml(gradStart)};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${escapeXml(gradEnd)};stop-opacity:1" />
    </linearGradient>` : ''}
  </defs>
  <g clip-path="url(#round-corner)">
    <rect width="${safeLeftWidth}" height="${safeHeight}" fill="${escapeXml(leftBg)}" />
    <rect x="${safeLeftWidth}" width="${rightW}" height="${safeHeight}" fill="${useGradient ? 'url(#grad-fin)' : escapeXml(rightBg)}" />
    ${outlineWidth > 0 ? `<rect width="${safeWidth}" height="${safeHeight}" fill="none" stroke="${escapeXml(outlineColor)}" stroke-width="${sanitize(outlineWidth, 0, 20) * 2}" rx="${r}" />` : ''}
  </g>
  ${renderIcon()}
  <g text-anchor="middle" font-family="${escapeXml(fontFamily)}">
    <text data-drag="leftText" style="cursor: grab;" x="${lTextX}" y="${lTextY}" fill="${escapeXml(leftTextColor)}" font-size="${sanitize(leftFontSize, 1, 100)}" font-weight="${escapeXml(leftFontWeight)}">${escapeXml(leftText)}</text>
    <text data-drag="rightText" style="cursor: grab;" x="${rTextX}" y="${rTextY}" fill="${escapeXml(rightTextColor)}" font-size="${sanitize(rightFontSize, 1, 100)}" font-weight="${escapeXml(rightFontWeight)}">${escapeXml(rightText)}</text>
  </g>
</svg>`.trim();

  // Editor-only drag hooks stay in the live preview; exported SVG is clean.
  const cleanSvg = svgString.replace(/ data-drag="[^"]*"/g, '').replace(/ style="cursor: grab;"/g, '');
  return { svg: cleanSvg, editorSvg: svgString, width: safeWidth, height: safeHeight, leftWidth: safeLeftWidth };
};
