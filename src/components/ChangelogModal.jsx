/*
 * Project: SVG Badge Builder
 * Author: DXBMARK LLC
 * Purpose: Changelog dialog — version history and release notes
 */

import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Chip, Divider, Stack,
  IconButton, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BuildCircleOutlineIcon from '@mui/icons-material/BuildCircleOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const CHANGELOG = [
  {
    version: 'v1.0.0',
    date: '2026-04-25',
    label: 'Initial Public Release',
    added: [
      'Live SVG badge preview with instant rendering',
      'Full badge customization — width, height, border radius, outline',
      'Independent left/right text controls with font family and weight selection',
      'Full color controls for backgrounds and text per section',
      'Gradient support with custom start/end color pickers',
      'Built-in icon presets with positioning and scaling controls',
      'Custom SVG icon upload support (max 500 KB, sanitized)',
      'Custom image icon URL support',
      'SVG export (download as .svg file)',
      'PNG raster export',
      'Copy SVG source code to clipboard',
      'README Markdown snippet generator (GitHub badge syntax)',
      'HTML embed snippet generator',
      'Built-in badge presets (WaQtor, GitHub-style, NPM-style, and more)',
      'Save & manage your own custom presets (localStorage)',
      'Build Diagnostics panel with Shields.io-standard compliance checks',
      'Dark Mode / Light Mode toggle',
      'Professional Material UI v9 theme (Minimal Dashboard aesthetic)',
      'Safe SVG text escaping and input validation',
      'Responsive layout for desktop and tablet',
      'SvgSource panel — theme-aware code view with tabbed output modes',
      'Open Graph, Twitter Card & JSON-LD structured metadata',
      'Badge Pack Builder — create, reorder, duplicate, and delete badge packs',
      '7 built-in packs: Developer Profile, React Project, Python Package, Django, Docker, CI/CD, Open Source',
      'Pack output modes: Inline Markdown, Stacked Markdown, HTML, Table',
      'Built-in pack loader with dynamic inputs (owner, repo, branch, workflow, etc.)',
      'Apply Brand to Pack — applies current style to all local badges in pack',
      'Save / Export / Import pack as JSON',
      'README Preview tab in Source panel — live mock GitHub README render',
      'Reset to Demo button in header toolbar',
      'Auto-save and restore badge config across page refreshes',
    ],
    changed: [],
    fixed: [],
  },
];

const TYPE_CONFIG = {
  added:   { icon: <AddCircleOutlineIcon fontSize="small" />, color: 'success', label: 'Added' },
  changed: { icon: <BuildCircleOutlineIcon fontSize="small" />, color: 'warning', label: 'Changed' },
  fixed:   { icon: <BugReportOutlinedIcon fontSize="small" />, color: 'error', label: 'Fixed' },
};

const ChangelogModal = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}
  >
    <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
      <AutoAwesomeIcon color="primary" fontSize="small" />
      <Typography variant="h6" component="span" sx={{ fontWeight: 900, flexGrow: 1 }}>
        Changelog
      </Typography>
      <IconButton size="small" onClick={onClose} sx={{ ml: 'auto' }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>

    <Divider />

    <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
      {CHANGELOG.map((entry) => (
        <Box key={entry.version} sx={{ mb: 3 }}>
          {/* Version header */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              label={entry.version}
              size="small"
              color="primary"
              sx={{ fontWeight: 900, letterSpacing: 0.5 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {entry.date}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              — {entry.label}
            </Typography>
          </Stack>

          {/* Sections */}
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const items = entry[key];
            if (!items || items.length === 0) return null;
            return (
              <Box key={key} sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                  <Box sx={{ color: `${cfg.color}.main`, display: 'flex' }}>{cfg.icon}</Box>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: `${cfg.color}.main`, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {cfg.label}
                  </Typography>
                </Stack>
                <List dense disablePadding sx={{ pl: 1 }}>
                  {items.map((item, i) => (
                    <ListItem key={i} disablePadding sx={{ py: 0.1 }}>
                      <ListItemIcon sx={{ minWidth: 16 }}>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: `${cfg.color}.main`, mt: 0.2 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'caption', sx: { color: 'text.secondary', lineHeight: 1.6 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          })}
        </Box>
      ))}

      <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 1 }}>
        Built with ❤️ by{' '}
        <Typography
          component="a"
          href="https://www.dxbmark.com/"
          target="_blank"
          rel="noopener noreferrer"
          variant="caption"
          sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
        >
          DXBMARK LLC
        </Typography>
      </Typography>
    </DialogContent>

    <Divider />

    <DialogActions sx={{ px: 3, py: 1.5 }}>
      <Button
        size="small"
        variant="text"
        href="https://github.com/DXBMark/badge-builder/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
      >
        View on GitHub
      </Button>
      <Button size="small" variant="contained" onClick={onClose} sx={{ fontWeight: 800, fontSize: '0.7rem', ml: 1 }}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ChangelogModal;
