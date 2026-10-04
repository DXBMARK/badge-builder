/*
 * Project: Badge Builder Pro
 * Purpose: Root component - dynamic ThemeProvider (Light / Dark).
 */

import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import App from './App.jsx';
import { ColorModeContext } from './colorModeContext';

export default function Root() {
  // DXBMARK dark style is the default; light mode stays available and is remembered.
  const [mode, setMode] = useState(() => {
    try {
      const saved = window.localStorage.getItem('bb_color_mode');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prevMode) => {
      const next = prevMode === 'light' ? 'dark' : 'light';
      try { window.localStorage.setItem('bb_color_mode', next); } catch { /* storage unavailable */ }
      return next;
    }),
  }), []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0F172A' : '#F8FAFC');
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App mode={mode} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
