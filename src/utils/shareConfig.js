/*
 * Project: SVG Badge Builder
 * Author: DXBMARK LLC
 * Purpose: Encode/Decode configurations via URL hash using lz-string
 */

import LZString from 'lz-string';

/**
 * Compresses an object to a URL-safe Base64 string
 * @param {Object} config - Badge config object
 * @returns {string}
 */
export const encodeConfigToHash = (config) => {
  try {
    const jsonStr = JSON.stringify(config);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (error) {
    console.error('[TS Error] Failed to encode config', error);
    return '';
  }
};

/**
 * Decompresses a URL-safe Base64 string back to an object
 * @param {string} hash - The URL hash (without the #config= part)
 * @returns {Object|null}
 */
export const decodeConfigFromHash = (rawHash) => {
  try {
    // Accept "#<data>", "#config=<data>" and bare "<data>".
    const hash = String(rawHash || '').replace(/^#/, '').replace(/^config=/, '');
    if (!hash || hash.length > 20000) return null;
    const jsonStr = LZString.decompressFromEncodedURIComponent(hash);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('[TS Error] Failed to decode config', error);
    return null;
  }
};
