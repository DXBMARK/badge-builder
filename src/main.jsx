/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Application Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Root from './Root.jsx';

// [TS] Load Google Fonts dynamically
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;600;700&family=Space+Grotesk:wght@400;600;700&family=Fira+Code:wght@400;600&family=Roboto:wght@400;500;700&display=swap';
document.head.appendChild(link);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
