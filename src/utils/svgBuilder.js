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
export const buildSVG = (config) => {
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
  
  // Approximate text width (Inter font average char width is ~0.55 of font size)
  const calcTextWidth = (text, size, weight) => {
    const baseW = (text || '').length * size * 0.55;
    return weight === 'bold' || weight >= 700 ? baseW * 1.1 : baseW;
  };

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
  let iX = 0, iY = 0, lTextX = 0, lTextY = 0, rTextX = 0, rTextY = 0;

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

  safeWidth = Math.round(safeWidth * 100) / 100;
  rightW = Math.round(rightW * 100) / 100;

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

  return { svg: svgString, width: safeWidth, height: safeHeight };
};
