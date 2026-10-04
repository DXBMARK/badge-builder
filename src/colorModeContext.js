/*
 * Project: Badge Builder Pro
 * Purpose: Colour-mode context (kept separate so main.jsx only exports nothing but runs the app).
 */
import { createContext } from 'react';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
