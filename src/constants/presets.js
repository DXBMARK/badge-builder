/*
 * Project: Badge Builder Pro
 * Author: [TS]
 * Purpose: Comprehensive Badge Presets Library
 * Notes: 30+ curated presets categorized for the Visual Presets System.
 */

export const PRESET_CATEGORIES = [
  { id: 'all', label: 'All Presets' },
  { id: 'style', label: 'Style & Layout' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'status', label: 'Status & CI' },
  { id: 'brand', label: 'Brand Kits' },
  { id: 'minimal', label: 'Minimalist' },
  { id: 'gradient', label: 'Gradients' }
];

export const PRESET_CONFIG_DEFAULTS = {
  fontFamily: 'sans-serif',
  iconType: 'none',
  iconMode: 'preset',
  autoWidth: false,
  smartAlign: true,
};

export const normalizePresetConfig = (config = {}) => ({
  ...PRESET_CONFIG_DEFAULTS,
  ...config,
});

export const BASE_PRESETS = [
  // --- BRAND / FEATURED ---
  {
    id: 'dxbmark-pro',
    name: 'Badge Builder Pro',
    category: 'brand',
    config: {
      leftText: "Badge Builder", rightText: "Pro",
      width: 160, height: 32, leftWidth: 108, borderRadius: 6,
      leftBg: "#0F172A", rightBg: "#F97E1A", useGradient: false,
      leftTextColor: "#FFFFFF", rightTextColor: "#0F172A",
      leftFontSize: 13, rightFontSize: 13, leftFontWeight: "800", rightFontWeight: "800",
      fontFamily: "Inter, sans-serif", iconType: "none", iconMode: "preset", iconScale: 1, autoWidth: true
    }
  },
  {
    id: 'waqtor-pro',
    name: 'WaQtor Pro',
    category: 'brand',
    config: {
      leftText: "WaQtor", rightText: "Pro",
      width: 150, height: 32, leftWidth: 92, borderRadius: 6,
      leftBg: "#0E1B3D", rightBg: "#FFC21A", useGradient: false,
      leftTextColor: "#FFFFFF", rightTextColor: "#0E1B3D",
      leftFontSize: 13, rightFontSize: 13, leftFontWeight: "800", rightFontWeight: "800",
      fontFamily: "Inter, sans-serif", iconType: "none", iconMode: "preset", autoWidth: true
    }
  },

  // --- STYLE & LAYOUT ---
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    category: 'style',
    config: {
      leftText: "github", rightText: "dark",
      width: 120, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#1f2328", rightBg: "#30363d", useGradient: false,
      leftTextColor: "#FFFFFF", rightTextColor: "#FFFFFF",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "400", rightFontWeight: "400",
      fontFamily: "sans-serif", iconType: "none"
    }
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    category: 'style',
    config: {
      leftText: "github", rightText: "light",
      width: 120, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#f6f8fa", rightBg: "#fff", useGradient: false,
      leftTextColor: "#1f2328", rightTextColor: "#1f2328",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "400", rightFontWeight: "400",
      outlineWidth: 1, outlineColor: "#d0d7de"
    }
  },
  {
    id: 'shields-flat',
    name: 'Shields Flat',
    category: 'style',
    config: {
      leftText: "shields", rightText: "flat",
      width: 110, height: 20, leftWidth: 55, borderRadius: 0,
      leftBg: "#555", rightBg: "#4c1", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "400", rightFontWeight: "400"
    }
  },
  {
    id: 'shields-plastic',
    name: 'Shields Plastic',
    category: 'style',
    config: {
      leftText: "shields", rightText: "plastic",
      width: 120, height: 20, leftWidth: 60, borderRadius: 4,
      leftBg: "#555555", rightBg: "#007ec6", useGradient: true,
      gradStart: "#38b6f5", gradEnd: "#0066b2",
      leftTextColor: "#FFFFFF", rightTextColor: "#FFFFFF",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "400", rightFontWeight: "600",
      fontFamily: "sans-serif", iconType: "none", autoWidth: false
    }
  },
  {
    id: 'terminal-style',
    name: 'Terminal',
    category: 'style',
    config: {
      leftText: "root@", rightText: "badge-builder",
      width: 180, height: 20, leftWidth: 60, borderRadius: 0,
      leftBg: "#000", rightBg: "#111", useGradient: false,
      leftTextColor: "#0f0", rightTextColor: "#0f0",
      leftFontSize: 11, rightFontSize: 11, fontFamily: "monospace",
      iconType: "terminal", iconMode: "preset", iconScale: 0.8, autoWidth: false
    }
  },

  // --- MINIMALIST ---
  {
    id: 'minimal-white',
    name: 'Minimal White',
    category: 'minimal',
    config: {
      leftText: "v1.0.0", rightText: "light",
      width: 130, height: 24, leftWidth: 60, borderRadius: 20,
      leftBg: "#ffffff", rightBg: "#f1f5f9", useGradient: false,
      leftTextColor: "#0f172a", rightTextColor: "#64748b",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700", rightFontWeight: "600",
      outlineWidth: 1, outlineColor: "#e2e8f0"
    }
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'minimal',
    config: {
      leftText: "PRO", rightText: "MODE",
      width: 110, height: 24, leftWidth: 45, borderRadius: 4,
      leftBg: "#0f172a", rightBg: "#1e293b", useGradient: false,
      leftTextColor: "#38bdf8", rightTextColor: "#94a3b8",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "800", rightFontWeight: "600"
    }
  },
  {
    id: 'clean-docs',
    name: 'Clean Docs',
    category: 'minimal',
    config: {
      leftText: "docs", rightText: "ready",
      width: 100, height: 20, leftWidth: 50, borderRadius: 12,
      leftBg: "#f8fafc", rightBg: "#f8fafc", useGradient: false,
      leftTextColor: "#475569", rightTextColor: "#0f172a",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "600", rightFontWeight: "700",
      outlineWidth: 1, outlineColor: "#e2e8f0"
    }
  },

  // --- TECH STACK ---
  {
    id: 'react-tech',
    name: 'React.js',
    category: 'tech',
    config: {
      leftText: "React", rightText: "v19",
      width: 110, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#20232a", rightBg: "#61dafb", useGradient: false,
      leftTextColor: "#61dafb", rightTextColor: "#20232a",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700", rightFontWeight: "700",
      iconType: "code", iconMode: "preset", iconScale: 0.8, iconX: 6, iconY: 4
    }
  },
  {
    id: 'vite-tech',
    name: 'Vite',
    category: 'tech',
    config: {
      leftText: "Vite", rightText: "Build",
      width: 110, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#646cff", rightBg: "#bd34fe", useGradient: true,
      gradStart: "#41d1ff", gradEnd: "#bd34fe",
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700"
    }
  },
  {
    id: 'python-tech',
    name: 'Python',
    category: 'tech',
    config: {
      leftText: "Python", rightText: "3.12",
      width: 120, height: 20, leftWidth: 60, borderRadius: 3,
      leftBg: "#3776ab", rightBg: "#ffd343", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#3776ab",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700", rightFontWeight: "700"
    }
  },
  {
    id: 'django-tech',
    name: 'Django',
    category: 'tech',
    config: {
      leftText: "Django", rightText: "Framework",
      width: 150, height: 20, leftWidth: 60, borderRadius: 3,
      leftBg: "#092e20", rightBg: "#092e20", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700"
    }
  },
  {
    id: 'docker-tech',
    name: 'Docker',
    category: 'tech',
    config: {
      leftText: "Docker", rightText: "Ready",
      width: 120, height: 20, leftWidth: 60, borderRadius: 3,
      leftBg: "#0db7ed", rightBg: "#2496ed", useGradient: true,
      gradStart: "#0db7ed", gradEnd: "#2496ed",
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700", rightFontWeight: "700"
    }
  },
  {
    id: 'nodejs-tech',
    name: 'Node.js',
    category: 'tech',
    config: {
      leftText: "Node", rightText: "LTS",
      width: 100, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#333", rightBg: "#3c873a", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700"
    }
  },
  {
    id: 'typescript-tech',
    name: 'TypeScript',
    category: 'tech',
    config: {
      leftText: "TS", rightText: "Strict",
      width: 100, height: 20, leftWidth: 40, borderRadius: 3,
      leftBg: "#3178c6", rightBg: "#235a97", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "800"
    }
  },
  {
    id: 'postgres-tech',
    name: 'PostgreSQL',
    category: 'tech',
    config: {
      leftText: "DB", rightText: "Postgres",
      width: 130, height: 20, leftWidth: 40, borderRadius: 3,
      leftBg: "#336791", rightBg: "#2f5e82", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700"
    }
  },
  {
    id: 'linux-tech',
    name: 'Linux',
    category: 'tech',
    config: {
      leftText: "Kernel", rightText: "v6.x",
      width: 120, height: 20, leftWidth: 60, borderRadius: 3,
      leftBg: "#333", rightBg: "#000", useGradient: false,
      leftTextColor: "#f8d500", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11, leftFontWeight: "700"
    }
  },

  // --- STATUS & CI ---
  {
    id: 'build-passing',
    name: 'Build Passing',
    category: 'status',
    config: {
      leftText: "build", rightText: "passing",
      width: 110, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#555", rightBg: "#4c1", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'build-failed',
    name: 'Build Failed',
    category: 'status',
    config: {
      leftText: "build", rightText: "failed",
      width: 110, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#555", rightBg: "#e05d44", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'coverage-high',
    name: 'Coverage 95%',
    category: 'status',
    config: {
      leftText: "coverage", rightText: "95%",
      width: 120, height: 20, leftWidth: 65, borderRadius: 3,
      leftBg: "#555", rightBg: "#4c1", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'license-mit',
    name: 'License MIT',
    category: 'status',
    config: {
      leftText: "license", rightText: "MIT",
      width: 100, height: 20, leftWidth: 55, borderRadius: 3,
      leftBg: "#555", rightBg: "#ff69b4", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'status-stable',
    name: 'Stable',
    category: 'status',
    config: {
      leftText: "status", rightText: "stable",
      width: 100, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#555", rightBg: "#007ec6", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'status-beta',
    name: 'Beta',
    category: 'status',
    config: {
      leftText: "status", rightText: "beta",
      width: 100, height: 20, leftWidth: 50, borderRadius: 3,
      leftBg: "#555", rightBg: "#fe7d37", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'open-source',
    name: 'Open Source',
    category: 'status',
    config: {
      leftText: "OS", rightText: "Community",
      width: 130, height: 20, leftWidth: 40, borderRadius: 3,
      leftBg: "#555", rightBg: "#44cc11", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },
  {
    id: 'maintained-yes',
    name: 'Maintained',
    category: 'status',
    config: {
      leftText: "maintained", rightText: "yes",
      width: 120, height: 20, leftWidth: 80, borderRadius: 3,
      leftBg: "#555", rightBg: "#4c1", useGradient: false,
      leftTextColor: "#fff", rightTextColor: "#fff",
      leftFontSize: 11, rightFontSize: 11
    }
  },

  // --- GRADIENTS ---
  {
    id: 'neon-dev',
    name: 'Neon Dev',
    category: 'gradient',
    config: {
      leftText: "NEON", rightText: "SYSTEM",
      width: 160, height: 28, leftWidth: 60, borderRadius: 4,
      leftBg: "#000", rightBg: "#0ff", useGradient: true,
      gradStart: "#f0f", gradEnd: "#0ff",
      leftTextColor: "#fff", rightTextColor: "#000",
      leftFontSize: 12, rightFontSize: 12, leftFontWeight: "900", rightFontWeight: "900"
    }
  },
  {
    id: 'soft-ocean',
    name: 'Soft Ocean',
    category: 'gradient',
    config: {
      leftText: "v2.0", rightText: "Ocean",
      width: 140, height: 28, leftWidth: 50, borderRadius: 8,
      leftBg: "#1e293b", rightBg: "#3b82f6", useGradient: true,
      gradStart: "#3b82f6", gradEnd: "#2dd4bf",
      leftTextColor: "#94a3b8", rightTextColor: "#fff",
      leftFontSize: 12, rightFontSize: 12, leftFontWeight: "600", rightFontWeight: "800"
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    category: 'gradient',
    config: {
      leftText: "PREMIUM", rightText: "BADGE",
      width: 160, height: 28, leftWidth: 70, borderRadius: 4,
      leftBg: "#2e1065", rightBg: "#7c3aed", useGradient: true,
      gradStart: "#7c3aed", gradEnd: "#db2777",
      leftTextColor: "#ddd6fe", rightTextColor: "#fff",
      leftFontSize: 12, rightFontSize: 12, leftFontWeight: "900"
    }
  }
];
