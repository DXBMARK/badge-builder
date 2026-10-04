/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Main Application Entry
 * Notes: Full MUI integration. Production ready.
 */

import { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { Box, Container, Typography, Button, AppBar, Toolbar, Snackbar, Alert, IconButton, Link, Paper, Stack, Chip, Menu, MenuItem, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import DownloadIcon from '@mui/icons-material/Download';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ShareIcon from '@mui/icons-material/Share';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';

// Context
import { ColorModeContext } from './colorModeContext';

// Constants & Tools
import { BASE_PRESETS } from './constants/presets';
import { buildSVG } from './utils/svgBuilder';
import { downloadSVG, downloadPNG, downloadJSON } from './utils/export';
import { useDrag } from './hooks/useDrag';
import { encodeConfigToHash, decodeConfigFromHash } from './utils/shareConfig';
import { sanitizeSvgFragment, sanitizeConfig } from './utils/safeSvg';

// Components
import LivePreview from './components/Preview/LivePreview';
import SvgSource from './components/Preview/SvgSource';
import TabBar from './components/Tabs/TabBar';
import ContentTab from './components/Tabs/ContentTab';
import LayoutTab from './components/Tabs/LayoutTab';
import StyleTab from './components/Tabs/StyleTab';
import IconTab from './components/Tabs/IconTab';
import PresetsTab from './components/Tabs/PresetsTab';
import GitHubTab from './components/Tabs/GitHubTab';
import BulkTab from './components/Tabs/BulkTab';
import ExportModal from './components/ExportModal';
import ChangelogModal from './components/ChangelogModal';
import DiagnosticsPanel from './components/DiagnosticsPanel';
import { runDiagnostics } from './core/diagnostics';
import { createMarkdownSnippet, createHtmlSnippet } from './utils/snippets';
import BrandTab from './components/Tabs/BrandTab';
import PackTab from './components/Tabs/PackTab';
import WorkspaceModal from './components/WorkspaceModal';

const cloneConfig = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return BASE_PRESETS[0].config;
  }

  if (window.location.hash) {
    const decoded = sanitizeConfig(
      decodeConfigFromHash(window.location.hash),
      { ...BASE_PRESETS[0].config, customSvgContent: '', customIconUrl: '' }
    );
    if (decoded) {
      return decoded;
    }
  }

  return readStoredJson('ts_badge_current', BASE_PRESETS[0].config);
};

const persistJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * [TS] Main Application Component
 */
const App = ({ mode }) => {
  const colorMode = useContext(ColorModeContext);

  /*
   * [TS] Application State
   */
  const [config, setConfig] = useState(() => getInitialConfig());
  const [customPresets, setCustomPresets] = useState(() => readStoredJson('ts_badge_presets_mui', {}));
  const [customBrands, setCustomBrands] = useState(() => readStoredJson('ts_badge_brands_mui', {}));
  const [activeTab, setActiveTab] = useState('content');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [showExport, setShowExport] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [helpAnchor, setHelpAnchor] = useState(null);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [gitHubContext, setGitHubContext] = useState({ 
    user: 'DXBMark', 
    repo: 'badge-builder', 
    branch: 'main', 
    path: 'badge.svg' 
  });

  const { handleDragStart, handleDragMove, handleDragEnd, dragState } = useDrag(config, setConfig);

  const handleShareUrl = useCallback(() => {
    try {
      const hash = encodeConfigToHash(config);
      window.location.hash = hash;
      navigator.clipboard.writeText(window.location.href);
      setToast({ open: true, message: 'Shareable URL Copied!', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Failed to generate URL', severity: 'error' });
    }
  }, [config]);

  // Reset to demo badge
  const handleResetDemo = useCallback(() => {
    setConfig(BASE_PRESETS[0].config);
    setToast({ open: true, message: 'Badge reset to demo.', severity: 'info' });
  }, []);

  // Phase 8: Workspace Restore
  const handleRestoreWorkspace = useCallback((data) => {
    // Accept both the current export keys (customPresets/customBrands) and the older ones.
    const presets = data.customPresets || data.presets;
    const brands = data.customBrands || data.brands;
    const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const safeDefaults = { ...BASE_PRESETS[0].config, customSvgContent: '', customIconUrl: '' };
    const cleanMap = (map) => Object.fromEntries(
      Object.entries(map).slice(0, 200).map(([name, value]) => [String(name).slice(0, 60), isPlainObject(value) && isPlainObject(value.config) ? { ...value, config: sanitizeConfig(value.config, safeDefaults) } : isPlainObject(value) ? sanitizeConfig(value, safeDefaults) : value])
    );
    if (isPlainObject(presets)) {
      const clean = cleanMap(presets);
      setCustomPresets(clean);
      persistJson('ts_badge_presets_mui', clean);
    }
    if (isPlainObject(brands)) {
      setCustomBrands(brands);
      persistJson('ts_badge_brands_mui', brands);
    }
    if (Array.isArray(data.pack)) {
      persistJson('bbp.currentPack', data.pack);
    }
    if (isPlainObject(data.config)) {
      const clean = sanitizeConfig(data.config, safeDefaults);
      setConfig(clean);
      persistJson('ts_badge_current', clean);
    }
    setToast({ open: true, message: 'Workspace restored', severity: 'success' });
  }, []);

  // Auto-save current badge whenever config changes
  useEffect(() => {
    if (!persistJson('ts_badge_current', config)) {
      return;
    }
  }, [config]);

  const savePreset = useCallback((name) => {
    const newPresets = {
      ...customPresets,
      [name]: cloneConfig(config),
    };

    setCustomPresets(newPresets);

    if (persistJson('ts_badge_presets_mui', newPresets)) {
      setToast({
        open: true,
        message: `Preset "${name}" Saved!`,
        severity: 'success',
      });
    } else {
      setToast({
        open: true,
        message: 'Failed to save preset',
        severity: 'error',
      });
    }
  }, [config, customPresets]);

  const deletePreset = useCallback((name) => {
    const newPresets = { ...customPresets };
    delete newPresets[name];
    setCustomPresets(newPresets);
    persistJson('ts_badge_presets_mui', newPresets);
  }, [customPresets]);

  const saveBrand = useCallback((brand) => {
    const newBrands = { ...customBrands, [brand.id]: brand };
    setCustomBrands(newBrands);
    if (persistJson('ts_badge_brands_mui', newBrands)) {
      setToast({ open: true, message: `Brand Kit "${brand.name}" Saved!`, severity: 'success' });
    }
  }, [customBrands]);

  const deleteBrand = useCallback((id) => {
    const newBrands = { ...customBrands };
    delete newBrands[id];
    setCustomBrands(newBrands);
    persistJson('ts_badge_brands_mui', newBrands);
  }, [customBrands]);

  /*
   * [TS] Computed Badge Data
   */
  const badgeData = useMemo(() => buildSVG(config), [config]);

  const diagnostics = useMemo(
    () => runDiagnostics(
      { ...config, width: badgeData.width, height: badgeData.height, leftWidth: badgeData.leftWidth },
      badgeData.svg
    ),
    [config, badgeData]
  );

  /*
   * [TS] Event Handlers
   */
  const handleCopy = useCallback((text, label) => {
    try {
      navigator.clipboard.writeText(text);
      setToast({ open: true, message: `${label} Copied to Clipboard!`, severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // [TS] Limit size to 500KB
    if (file.size > 500 * 1024) {
      setToast({ open: true, message: '[TS Error] File too large! Max 500KB allowed.', severity: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (file.type === 'image/svg+xml') {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(event.target.result, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (svgEl) {
            setConfig(prev => ({ ...prev, customSvgContent: sanitizeSvgFragment(svgEl.innerHTML), iconMode: 'custom-svg' }));
            setToast({ open: true, message: 'SVG Icon Loaded', severity: 'success' });
            return;
          }
        } catch {
          return;
        }
      }
      setConfig(prev => ({ ...prev, customIconUrl: event.target.result, iconMode: 'custom' }));
      setToast({ open: true, message: 'Image Icon Loaded', severity: 'success' });
    };

    if (file.type === 'image/svg+xml') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }, []);

  const update = useCallback((key, val) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleExportSVG = () => {
    downloadSVG(badgeData.svg, 'badge.svg');
    setToast({ open: true, message: 'SVG Downloaded', severity: 'success' });
    setShowExport(false);
  };

  const handleExportPNG = (scale = 2) => {
    downloadPNG(badgeData.svg, badgeData.width, badgeData.height, 'badge.png', scale);
    setToast({ open: true, message: `PNG (${scale}x) Downloaded`, severity: 'success' });
    setShowExport(false);
  };

  const handleCopySnippet = (type) => {
    let text = '';
    if (type === 'MARKDOWN') {
      text = createMarkdownSnippet(config);
    } else if (type === 'HTML') {
      text = createHtmlSnippet(badgeData.svg, config);
    } else if (type === 'JSON') {
      text = JSON.stringify(config, null, 2);
    }

    handleCopy(text, type);
    setShowExport(false);
  };

  const handleExportConfig = () => {
    downloadJSON(config, 'badge-config.json');
    setToast({ open: true, message: 'Config JSON Downloaded', severity: 'success' });
    setShowExport(false);
  };

  return (
    <Box 
      sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}
      onMouseMove={handleDragMove} 
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <AppBar position="static" color="inherit" elevation={0} sx={{ flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', mb: 1, bgcolor: 'background.paper', transition: 'background-color 0.3s ease' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1, minHeight: { xs: 56, sm: 64 } }}>

            {/* ── Brand / Logo ───────────────────────────────── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Box
                component="img"
                src="/badge-builder/logo.png"
                alt="Badge Builder Pro logo"
                sx={{ height: { xs: 32, sm: 38 }, width: 'auto', borderRadius: 1.5, display: 'block', flexShrink: 0 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                  component="h1"
                  variant="h6"
                  sx={{
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: 'text.primary',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Badge Builder Pro
                </Typography>
                <Chip
                  label="v1"
                  size="small"
                  sx={{
                    fontWeight: 900,
                    bgcolor: 'primary.main',
                    color: 'background.paper',
                    height: 20,
                    fontSize: '0.65rem',
                    display: { xs: 'none', sm: 'flex' },
                  }}
                />
              </Box>
            </Box>

            {/* ── Toolbar actions ────────────────────────────── */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }} sx={{ alignItems: 'center' }}>
              {/* Share — hidden on xs */}
              <IconButton
                onClick={handleShareUrl}
                title="Share via Config URL"
                sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' }, '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}
              >
                <ShareIcon />
              </IconButton>

              {/* Reset demo */}
              <IconButton
                onClick={handleResetDemo}
                title="Reset to Demo Badge"
                sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main', bgcolor: 'action.hover' } }}
              >
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Workspace — hidden on xs */}
              <IconButton
                onClick={() => setShowWorkspace(true)}
                title="Workspace Export/Import"
                sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' }, '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}
              >
                <CloudSyncIcon />
              </IconButton>

              {/* Dark mode toggle */}
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Help & support */}
              <IconButton
                onClick={(e) => setHelpAnchor(e.currentTarget)}
                title="Help & support"
                aria-label="Help and support"
                aria-haspopup="menu"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}
              >
                <HelpOutlineIcon />
              </IconButton>
              <Menu anchorEl={helpAnchor} open={Boolean(helpAnchor)} onClose={() => setHelpAnchor(null)}>
                {[
                  ['Documentation', 'https://github.com/DXBMARK/badge-builder#readme'],
                  ['Report an issue', 'https://github.com/DXBMARK/badge-builder/issues'],
                  ['Contact DXBMARK', 'https://www.dxbmark.com/contact'],
                ].map(([label, href]) => (
                  <MenuItem key={label} component="a" href={href} target="_blank" rel="noopener noreferrer" onClick={() => setHelpAnchor(null)}>{label}</MenuItem>
                ))}
                <MenuItem onClick={() => { setHelpAnchor(null); setShowChangelog(true); }}>What&apos;s new</MenuItem>
                <Divider />
                {[
                  ['Terms', 'https://www.dxbmark.com/legal/terms-of-service'],
                  ['Privacy', 'https://www.dxbmark.com/legal/privacy-policy'],
                ].map(([label, href]) => (
                  <MenuItem key={label} component="a" href={href} target="_blank" rel="noopener noreferrer" onClick={() => setHelpAnchor(null)} sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{label}</MenuItem>
                ))}
              </Menu>

              {/* GitHub — hidden on xs */}
              <IconButton
                component={Link}
                href="https://github.com/DXBMARK/badge-builder"
                target="_blank"
                sx={{ color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' }, '&:hover': { color: 'primary.main', bgcolor: 'action.hover' } }}
              >
                <GitHubIcon />
              </IconButton>

              {/* Export CTA — icon-only on xs, full label on sm+ */}
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => setShowExport(true)}
                sx={{
                  borderRadius: 2,
                  px: { xs: 1.5, sm: 3 },
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  minWidth: 0,
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>EXPORT ASSET</Box>
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content — natural page scroll */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 5fr) minmax(0, 6fr)' }, gap: 4, alignItems: 'start' }}>

            {/* Left column — Preview + Source */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <LivePreview 
                svg={badgeData.editorSvg} 
                config={config}
                onDragStart={handleDragStart} 
                dragState={dragState}
                statusMsg={toast.open ? toast.message : ''} 
                onCopy={handleCopy}
              />
              <SvgSource 
                svg={badgeData.svg} 
                config={config}
                onCopy={handleCopy} 
              />
            </Box>

            {/* Right column — Editor + Diagnostics */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
                <Box sx={{ p: { xs: 2, sm: 3 }, maxHeight: { xs: 'none', lg: 'calc(100vh - 220px)' }, overflowY: { xs: 'visible', lg: 'auto' } }}>
                  {activeTab === 'content' && <ContentTab config={config} update={update} />}
                  {activeTab === 'layout' && <LayoutTab config={config} update={update} />}
                  {activeTab === 'style' && <StyleTab config={config} update={update} />}
                  {activeTab === 'icon' && <IconTab config={config} update={update} onFileUpload={handleFileUpload} />}
                  {activeTab === 'presets' && (
                    <PresetsTab 
                      setConfig={setConfig} 
                      customPresets={customPresets} 
                      savePreset={savePreset}
                      deletePreset={deletePreset}
                    />
                  )}
                  {activeTab === 'brand' && <BrandTab config={config} update={update} customBrands={customBrands} saveBrand={saveBrand} deleteBrand={deleteBrand} />}
                  {activeTab === 'pack' && <PackTab config={config} onCopy={handleCopy} onLoadBadge={setConfig} />}
                  {activeTab === 'github' && (
                    <GitHubTab 
                      context={gitHubContext} 
                      setContext={setGitHubContext} 
                      onCopy={handleCopy} 
                    />
                  )}
                  {activeTab === 'bulk' && (
                    <BulkTab 
                      config={config} 
                      onCopy={handleCopy} 
                    />
                  )}
                </Box>
              </Paper>
              <DiagnosticsPanel results={diagnostics} />
            </Box>

          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 'auto', py: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Typography variant="caption" component="p" sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center', m: 0 }}>
            © {new Date().getFullYear()} Badge Builder Pro by{' '}
            <Typography
              component="a"
              href="https://www.dxbmark.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              sx={{ color: 'inherit', fontWeight: 700, textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
            >
              DXBMARK LLC
            </Typography>
            .
          </Typography>
        </Container>
      </Box>

      <ChangelogModal open={showChangelog} onClose={() => setShowChangelog(false)} />

      <WorkspaceModal 
        open={showWorkspace} 
        onClose={() => setShowWorkspace(false)} 
        onRestoreWorkspace={handleRestoreWorkspace} 
        config={config}
        customPresets={customPresets} 
        customBrands={customBrands} 
      />

      <ExportModal 
        show={showExport} 
        onClose={() => setShowExport(false)} 
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
        onCopyCode={() => handleCopy(badgeData.svg, 'SVG Code')}
        onCopyMarkdown={() => handleCopySnippet('MARKDOWN')}
        onCopyHTML={() => handleCopySnippet('HTML')}
        onCopyJSON={() => handleCopySnippet('JSON')}
        onExportConfig={handleExportConfig}
      />

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 700, borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
