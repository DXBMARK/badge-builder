/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Export Utilities
 * Notes: Follow TS conventions.
 */

/**
 * [TS] Downloads a string as an SVG file.
 * @param {string} svgContent
 * @param {string} fileName
 */
export const downloadSVG = (svgContent, fileName = 'badge.svg') => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * [TS] Converts SVG to PNG with custom scale and downloads it.
 */
export const downloadPNG = (svgContent, width, height, fileName = 'badge.png', scale = 2) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const img = new Image();
  // A data URI (not a blob: URL) so it passes the page's img-src Content Security Policy.
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  img.onerror = () => {
    console.error('[Badge Builder] PNG export failed: the SVG could not be rasterised.');
  };

  img.src = url;
};

/**
 * [TS] Downloads JSON data as a file.
 */
export const downloadJSON = (data, fileName = 'config.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
