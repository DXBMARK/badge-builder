/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Live Preview Component
 * Notes: Follow TS conventions.
 */

import React from 'react';
import { 
  Paper, Box, Typography, Fade, IconButton, 
  Tooltip, ToggleButtonGroup, ToggleButton, Stack,
  Divider, Button
} from '@mui/material';
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import RestartAlt from '@mui/icons-material/RestartAlt';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import GridView from '@mui/icons-material/GridView';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const BACKGROUND_STYLES = {
  transparent: {
    background: 'repeating-conic-gradient(#c8c8c8 0% 25%, #f4f4f4 0% 50%) 0 0 / 20px 20px',
  },
  light: {
    backgroundColor: '#ffffff',
  },
  dark: {
    backgroundColor: '#0d1117',
    backgroundImage: 'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 45%)',
  },
  github: {
    backgroundColor: '#F7F8FA',
    backgroundImage: 'linear-gradient(180deg, rgba(208,215,222,0.22), rgba(246,248,250,0) 140px)',
  },
};

const createMarkdownSnippet = (config) => {
  const label = config.leftText || 'Badge';
  const value = config.rightText || 'Value';
  const color = (config.rightBg || '#4c1').replace('#', '');

  return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color})`;
};

const LivePreview = ({ svg, config, onDragStart, dragState, statusMsg, onCopy }) => {
  const [zoom, setZoom] = React.useState(1);
  const [bgMode, setBgMode] = React.useState('github');
  const [previewMode, setPreviewMode] = React.useState('single'); // 'single', 'readme', 'profile'
  
  const isDragging = !!dragState;
  const isReadmePreview = previewMode === 'readme';
  const isDarkPreview = bgMode === 'dark';
  // GitHub-style mock surfaces follow the selected preview background, not the app theme.
  const gh = isDarkPreview
    ? { card: '#0d1117', border: '#30363d', rule: '#21262d', link: '#58a6ff', skel: 'rgba(240,246,252,0.14)', tile: 'rgba(240,246,252,0.07)', banner: '#161b22', shadow: '0 0 0 1px rgba(48,54,61,0.9), 0 12px 30px rgba(0,0,0,0.45)' }
    : { card: '#ffffff', border: '#d0d7de', rule: '#e1e4e8', link: '#0969da', skel: 'rgba(31,35,40,0.14)', tile: 'rgba(31,35,40,0.06)', banner: '#eaeef2', shadow: '0 0 0 1px rgba(208,215,222,0.8), 0 12px 30px rgba(31,35,40,0.08)' };

  const handleZoom = (delta) => setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));

  return (
  <Paper sx={{ overflow: 'hidden', borderRadius: 4, border: isDragging ? '2px solid' : '1px solid', borderColor: isDragging ? 'primary.main' : 'divider', transition: 'all 0.2s' }}>
    <Box sx={{ 
      px: { xs: 2, sm: 3 }, 
      py: 1.5, 
      borderBottom: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 1.25, sm: 0 },
      bgcolor: 'background.neutral'
    }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
        <Typography variant="overline" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 900, color: isDragging ? 'primary.main' : 'text.secondary', mr: 2 }}>
          {isDragging ? 'DRAGGING...' : 'PREVIEW'}
        </Typography>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, my: 'auto' }} />
        
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Zoom Out"><IconButton size="small" onClick={() => handleZoom(-0.2)}><ZoomOut fontSize="inherit" /></IconButton></Tooltip>
          <Typography variant="caption" sx={{ minWidth: 35, textAlign: 'center', lineHeight: '28px', fontWeight: 900, color: 'primary.main' }}>{Math.round(zoom * 100)}%</Typography>
          <Tooltip title="Zoom In"><IconButton size="small" onClick={() => handleZoom(0.2)}><ZoomIn fontSize="inherit" /></IconButton></Tooltip>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, my: 'auto' }} />

        <ToggleButtonGroup
          size="small"
          value={bgMode}
          exclusive
          onChange={(_, val) => val && setBgMode(val)}
          sx={{ height: 28, flexWrap: 'wrap', '& .MuiToggleButton-root': { px: { xs: 1, sm: 1.5 }, fontSize: '0.65rem', fontWeight: 800 } }}
        >
          <ToggleButton value="transparent">GRID</ToggleButton>
          <ToggleButton value="light">LIGHT</ToggleButton>
          <ToggleButton value="dark">DARK</ToggleButton>
          <ToggleButton value="github">GITHUB</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' }, flexWrap: 'wrap', rowGap: 1 }}>
        <Fade in={!!statusMsg}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', mr: 2 }}>
            {statusMsg}
          </Typography>
        </Fade>
        <ToggleButtonGroup
          size="small"
          value={previewMode}
          exclusive
          onChange={(_, val) => val && setPreviewMode(val)}
          sx={{ height: 28, flexWrap: 'wrap' }}
        >
          <Tooltip title="Single Badge"><ToggleButton value="single"><Visibility fontSize="inherit" /></ToggleButton></Tooltip>
          <Tooltip title="README Context"><ToggleButton value="readme"><MenuBookIcon fontSize="inherit" /></ToggleButton></Tooltip>
          <Tooltip title="Profile Context"><ToggleButton value="profile"><GridView fontSize="inherit" /></ToggleButton></Tooltip>
        </ToggleButtonGroup>
      </Stack>
    </Box>

    <Box 
      sx={{ 
        p: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...BACKGROUND_STYLES[bgMode],
        minHeight: { xs: 160, sm: 200 },
        cursor: isDragging ? 'grabbing' : 'default',
        position: 'relative',
        transition: 'background-color 0.3s ease, background-image 0.3s ease',
        overflow: 'auto'
      }} 
      onMouseDown={onDragStart}
    >
      <Box sx={{ 
        transform: `scale(${zoom})`,
        transition: 'transform 0.2s ease, filter 0.3s',
        filter: isDragging ? 'drop-shadow(0 30px 50px rgba(0,0,0,0.3))' : 'none',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: previewMode === 'single' ? 0 : { xs: 2, sm: 4, md: 6 },
        bgcolor: isReadmePreview ? gh.card : 'transparent',
        borderRadius: isReadmePreview ? 2 : 0,
        boxShadow: isReadmePreview
          ? gh.shadow
          : isDarkPreview
            ? '0 18px 35px rgba(0,0,0,0.35)'
            : 'none',
        border: isReadmePreview ? `1px solid ${gh.border}` : 'none',
        maxWidth: { xs: '100%', sm: '90%' }
      }}>
        {/* Overlay grid when dragging */}
        {isDragging && (
          <Box sx={{ 
            position: 'absolute', inset: -20, 
            border: '2px dashed', borderColor: 'primary.main', 
            borderRadius: 2, pointerEvents: 'none', opacity: 0.5,
            background: 'rgba(249,126,26,0.04)'
          }} />
        )}
        
        {isReadmePreview && (
          <Box sx={{ mb: 2, borderBottom: `1px solid ${gh.rule}`, pb: 1, width: '100%', minWidth: { xs: 240, sm: 300 } }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: gh.link, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon sx={{ fontSize: 16 }} /> README.md
            </Typography>
          </Box>
        )}

        {previewMode !== 'profile' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: svg }} style={{ pointerEvents: isDragging ? 'none' : 'auto' }} />
          </Box>
        )}

        {previewMode === 'profile' && (
          <Box
            sx={{
              mt: 3,
              width: '100%',
              minWidth: { xs: 260, sm: 320 },
              maxWidth: 420,
              borderRadius: 3,
              border: `1px solid ${gh.border}`,
              bgcolor: gh.card,
              boxShadow: '0 10px 28px rgba(15,23,42,0.12)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ height: 54, bgcolor: gh.banner }} />
            <Box sx={{ px: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mt: -2.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: `3px solid ${gh.card}`,
                    bgcolor: gh.skel,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, pb: 0.5 }}>
                  <Box sx={{ width: '42%', height: 10, borderRadius: 999, bgcolor: gh.skel, mb: 0.8 }} />
                  <Box sx={{ width: '28%', height: 8, borderRadius: 999, bgcolor: gh.skel }} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.75 }}>
                <div dangerouslySetInnerHTML={{ __html: svg }} style={{ pointerEvents: isDragging ? 'none' : 'auto' }} />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                <Box sx={{ height: 42, borderRadius: 2, bgcolor: gh.tile }} />
                <Box sx={{ height: 42, borderRadius: 2, bgcolor: gh.tile }} />
                <Box sx={{ height: 42, borderRadius: 2, bgcolor: gh.tile }} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>

    <Box sx={{ px: 3, py: 1.5, bgcolor: 'background.neutral', borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
      <Button 
        size="small" 
        variant="outlined" 
        startIcon={<ContentCopy fontSize="inherit" />}
        onClick={() => onCopy(svg, 'SVG Code')}
        sx={{ fontWeight: 800, fontSize: '0.65rem' }}
      >
        Copy SVG
      </Button>
      <Button 
        size="small" 
        variant="outlined" 
        startIcon={<ContentCopy fontSize="inherit" />}
        onClick={() => {
           const md = createMarkdownSnippet(config);
           onCopy(md, 'Markdown Link');
        }}
        sx={{ fontWeight: 800, fontSize: '0.65rem' }}
      >
        Copy Markdown
      </Button>
      <Divider orientation="vertical" flexItem />
      <IconButton size="small" onClick={() => setZoom(1)} sx={{ ml: 'auto' }}><RestartAlt fontSize="small" /></IconButton>
    </Box>
  </Paper>
  );
};

export default LivePreview;
