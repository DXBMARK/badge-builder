/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Application Entry Point
 * Notes: Dynamic ThemeProvider (Light / Dark).
 */

import React, { StrictMode, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import './index.css';
import App from './App.jsx';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

// [TS] Load Google Fonts dynamically
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&family=Fira+Code:wght@400;600&family=Roboto:wght@400;500;700&display=swap';
document.head.appendChild(link);

function Root() {
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

  React.useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0F172A' : '#F9FAFB');
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
