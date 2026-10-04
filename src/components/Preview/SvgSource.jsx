/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI SVG Source Code Component
 * Notes: Fixed dark theme, icon colors, and code readability.
 */

import React, { useMemo, useState } from 'react';
import { Paper, Box, Typography, IconButton, Tooltip, Chip, Tabs, Tab, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PreviewIcon from '@mui/icons-material/Visibility';

const SvgSource = ({ svg, config, onCopy }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const sourceTheme = {
    rootBg: isDark ? theme.palette.grey[900] : theme.palette.grey[50],
    headerBg: isDark ? alpha(theme.palette.common.black, 0.28) : theme.palette.common.white,
    tabsBg: isDark ? alpha(theme.palette.common.black, 0.42) : theme.palette.grey[100],
    codeText: isDark ? theme.palette.grey[300] : theme.palette.grey[900],
    mutedText: isDark ? theme.palette.grey[400] : theme.palette.grey[600],
    strongText: isDark ? theme.palette.grey[100] : theme.palette.grey[900],
    border: alpha(theme.palette.divider, isDark ? 0.75 : 1),
    subtleBorder: alpha(theme.palette.divider, isDark ? 0.55 : 0.85),
    hoverBg: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
    selectedBg: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
    chipBg: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08),
    copyBg: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
  };

  const [activeTab, setActiveTab] = React.useState('svg');
  const [expanded, setExpanded] = useState(false);

  const snippets = useMemo(() => {
    const label = config.leftText || 'Badge';
    const value = config.rightText || 'Value';
    const color = (config.rightBg || '#4c1').replace('#', '');
    const md = `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color})`;
    let htmlSnippet = '';
    let svgDataUrl = '';
    try {
      const bytes = new TextEncoder().encode(svg);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
      const safeB64 = btoa(binString);
      htmlSnippet = `<img src="data:image/svg+xml;base64,${safeB64}" alt="${label}" />`;
      svgDataUrl = `data:image/svg+xml;base64,${safeB64}`;
    } catch (e) {
      console.error("[TS Error] SvgSource encoding failed:", e);
      htmlSnippet = '<!-- Error: Unable to encode SVG to Base64 -->';
    }
    const json = JSON.stringify(config, null, 2);
    const github = `[![${label}](https://raw.githubusercontent.com/DXBMark/badge-builder/main/badge.svg)](https://github.com/DXBMark/badge-builder)`;

    return {
      svg,
      markdown: md,
      html: htmlSnippet,
      json,
      github,
      _svgDataUrl: svgDataUrl,
      _md: md,
      _label: label,
      _value: value,
    };
  }, [svg, config]);

  const activeContent = activeTab === 'readme' ? snippets._md : snippets[activeTab];

  return (
    <Paper
      sx={{
        bgcolor: sourceTheme.rootBg,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: sourceTheme.border,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows[isDark ? 2 : 4],
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: sourceTheme.subtleBorder,
          bgcolor: sourceTheme.tabsBg,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              px: 2,
              fontSize: '0.68rem',
              color: sourceTheme.mutedText,
              fontWeight: 900,
              letterSpacing: '0.04em',
              opacity: 1,
              '& svg': {
                color: sourceTheme.mutedText,
              },
              '&:hover': {
                color: sourceTheme.strongText,
                bgcolor: sourceTheme.hoverBg,
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                bgcolor: sourceTheme.selectedBg,
              },
              '&.Mui-selected svg': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          <Tab value="svg" label="SVG" icon={<CodeIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
          <Tab value="markdown" label="MARKDOWN" icon={<DescriptionIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
          <Tab value="html" label="HTML" icon={<CodeIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
          <Tab value="json" label="JSON" icon={<StorageIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
          <Tab value="github" label="GH README" icon={<MenuBookIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
          <Tab value="readme" label="PREVIEW" icon={<PreviewIcon sx={{ fontSize: 15 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 1.25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: sourceTheme.headerBg,
          borderBottom: '1px solid',
          borderColor: sourceTheme.subtleBorder,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'error.main' }} />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'success.main' }} />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: sourceTheme.strongText,
              fontWeight: 900,
              textTransform: 'uppercase',
              ml: 1,
              letterSpacing: '0.08em',
            }}
          >
            output.{activeTab === 'json' ? 'json' : activeTab === 'markdown' ? 'md' : activeTab}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${new Blob([activeContent]).size} B`}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.6rem',
              fontWeight: 900,
              bgcolor: sourceTheme.chipBg,
              color: theme.palette.primary.main,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.28),
            }}
          />

          <Tooltip title={`Copy ${activeTab.toUpperCase()}`} placement="top">
            <IconButton
              size="small"
              onClick={() => onCopy(activeContent, activeTab.toUpperCase())}
              aria-label={`Copy ${activeTab.toUpperCase()}`}
              sx={{
                color: theme.palette.primary.main,
                bgcolor: sourceTheme.copyBg,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.28),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.28 : 0.16),
                },
                width: 28,
                height: 28,
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', bgcolor: sourceTheme.rootBg }}>
        {activeTab === 'readme' ? (
          /* ─── README Preview pane ─────────────────────────────────────────── */
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                bgcolor: isDark ? '#0d1117' : '#ffffff',
                border: '1px solid',
                borderColor: isDark ? '#30363d' : '#d0d7de',
                borderRadius: 2,
                p: 3,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                color: isDark ? '#c9d1d9' : '#24292f',
              }}
            >
              {/* Mock README header */}
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid', borderColor: isDark ? '#30363d' : '#d0d7de', pb: 1, mb: 2, color: isDark ? '#e6edf3' : '#1f2328', fontFamily: 'inherit' }}>
                my-awesome-project
              </Typography>
              <Box sx={{ mb: 2 }}>
                {snippets._svgDataUrl ? (
                  <img src={snippets._svgDataUrl} alt={snippets._label} style={{ display: 'inline-block', maxHeight: 40 }} />
                ) : (
                  <Chip label="Badge render unavailable" size="small" />
                )}
              </Box>
              <Typography sx={{ fontSize: '0.875rem', lineHeight: 1.6, color: isDark ? '#8b949e' : '#656d76', fontFamily: 'inherit', mb: 2 }}>
                A short description of your project goes here.
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, mb: 1, color: isDark ? '#e6edf3' : '#1f2328', fontFamily: 'inherit' }}>
                Installation
              </Typography>
              <Box sx={{ bgcolor: isDark ? '#161b22' : '#f6f8fa', border: '1px solid', borderColor: isDark ? '#30363d' : '#d0d7de', borderRadius: 1, p: 1.5 }}>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: isDark ? '#c9d1d9' : '#24292f' }}>
                  npm install my-awesome-project
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', textAlign: 'center', fontSize: '0.7rem' }}>
              Mock GitHub README preview — badge renders as it would appear in a real README.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyIcon sx={{ fontSize: '0.75rem !important' }} />}
              onClick={() => onCopy(snippets._md, 'Markdown Snippet')}
              sx={{ mt: 1.5, fontWeight: 800, fontSize: '0.65rem', display: 'flex', mx: 'auto' }}
            >
              Copy Markdown
            </Button>
          </Box>
        ) : (
        <>
          <Box
          sx={{
            p: 2.25,
            maxHeight: expanded ? 'none' : 150,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
          <Box
            component="pre"
            sx={{
              m: 0,
              fontFamily: '"Fira Code", monospace',
              fontSize: '0.76rem',
              lineHeight: 1.75,
              color: sourceTheme.codeText,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {activeContent}
          </Box>
        </Box>

        {!expanded && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 36,
              left: 0,
              right: 0,
              height: 70,
              background: `linear-gradient(${alpha(sourceTheme.rootBg, 0)}, ${sourceTheme.rootBg})`,
              pointerEvents: 'none',
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 0.75,
            bgcolor: sourceTheme.rootBg,
            borderTop: '1px solid',
            borderColor: sourceTheme.subtleBorder,
          }}
        >
          <Button
            size="small"
            onClick={() => setExpanded(v => !v)}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  fontSize: 16,
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            }
            sx={{
              fontSize: '0.68rem',
              fontWeight: 900,
              color: sourceTheme.mutedText,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              '&:hover': {
                color: theme.palette.primary.main,
                bgcolor: sourceTheme.hoverBg,
              },
            }}
          >
            {expanded ? 'Collapse' : 'View Full'}
          </Button>
        </Box>
        </>
        )}
      </Box>
    </Paper>
  );
};

export default SvgSource;
