/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Theme Configuration
 * Notes: Minimal Dashboard inspiration with Dark Mode support.
 */

import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#212B36', contrastText: '#FFFFFF' },
          secondary: { main: '#00AB55', contrastText: '#FFFFFF' },
          background: { default: '#F9FAFB', paper: '#FFFFFF', neutral: '#F4F6F8' },
          text: { primary: '#212B36', secondary: '#637381', disabled: '#919EAB' },
          divider: 'rgba(145, 158, 171, 0.2)',
          success: { main: '#00AB55', lighter: '#C8FACD', dark: '#007B55' },
          error: { main: '#FF4842', lighter: '#FFE7D9', dark: '#B71D18' },
        }
      : {
          // DXBMARK dark style: deep navy canvas, orange brand accent.
          primary: { main: '#F97E1A', light: '#FFA24D', dark: '#E89548', contrastText: '#0F172A' },
          secondary: { main: '#34D399', contrastText: '#0F172A' },
          background: { default: '#0F172A', paper: '#141C30', neutral: '#1B2540' },
          text: { primary: '#FFFFFF', secondary: '#C3CAD6', disabled: '#8B95A7' },
          divider: 'rgba(255, 255, 255, 0.10)',
          success: { main: '#34D399', lighter: 'rgba(52, 211, 153, 0.14)', dark: '#6EE7B7' },
          error: { main: '#FF6B66', lighter: 'rgba(255, 107, 102, 0.16)', dark: '#FFA48D' },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Public Sans", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        containedPrimary: {
          backgroundColor: mode === 'light' ? '#212B36' : '#F97E1A',
          color: mode === 'light' ? '#FFFFFF' : '#0F172A',
          '&:hover': { backgroundColor: mode === 'light' ? '#454F5B' : '#E89548' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: mode === 'light' 
            ? '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)'
            : '0 0 0 1px rgba(255, 255, 255, 0.06), 0 12px 24px -4px rgba(0, 0, 0, 0.45)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
export default getTheme('dark');
