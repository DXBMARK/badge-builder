/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Icon/Asset Customization Tab
 * Notes: Smart search-only, tooltip names, no nested scroll.
 */

import React from 'react';
import { 
  Box, Typography, ToggleButtonGroup, ToggleButton, Slider, Paper, Stack,
  Tooltip, IconButton, TextField, InputAdornment
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { ICON_LIBRARY } from '../../constants/icons';

/** Formats icon key into a human-readable label for tooltips. */
const formatLabel = (key) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2')
     .replace(/[-_]/g, ' ')
     .replace(/\b\w/g, c => c.toUpperCase());

/** Smart search: matches key + category, supports partial and fuzzy order. */
const matchesSearch = (key, category, q) => {
  if (!q) return true;
  const haystack = `${key} ${category}`.toLowerCase();
  const needle = q.toLowerCase().trim();
  // Each word in query must appear somewhere in the haystack
  return needle.split(/\s+/).every(w => haystack.includes(w));
};

const IconTab = ({ config, update, onFileUpload }) => {
  const [search, setSearch] = React.useState('');
  const activeIconKey = config.iconType;

  const filteredIcons = React.useMemo(() =>
    Object.entries(ICON_LIBRARY).filter(([key, data]) =>
      matchesSearch(key, data.category, search)
    ),
    [search]
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Mode toggle */}
      <ToggleButtonGroup
        fullWidth
        value={config.iconMode === 'preset' ? 'preset' : 'custom'}
        exclusive
        onChange={(_, mode) => mode && update('iconMode', mode === 'preset' ? 'preset' : 'custom-svg')}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="preset"  sx={{ fontWeight: 800, fontSize: '0.625rem' }}>ICON LIBRARY</ToggleButton>
        <ToggleButton value="custom"  sx={{ fontWeight: 800, fontSize: '0.625rem' }}>CUSTOM ASSETS</ToggleButton>
      </ToggleButtonGroup>

      {config.iconMode === 'preset' ? (
        <Stack spacing={1.5}>
          {/* Smart search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search icons… e.g. react, cloud, db"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'background.neutral' },
            } }}
          />

          {/* Result count */}
          <Typography variant="caption" sx={{ color: 'text.disabled', pl: 0.5 }}>
            {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
            {search ? ` matching "${search}"` : ' available'}
          </Typography>

          {/* Icon grid — 8 per row, compact */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 0.5,
            }}
          >
            {/* None button */}
            <Tooltip title="No icon" placement="top" arrow>
              <Paper
                component="button"
                onClick={() => update('iconType', 'none')}
                sx={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '1.5px solid',
                  borderColor: activeIconKey === 'none' ? 'primary.main' : 'divider',
                  bgcolor: 'background.paper', borderRadius: 1.5,
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1 }}>×</Typography>
              </Paper>
            </Tooltip>

            {filteredIcons.map(([k, data]) => (
              <Tooltip key={k} title={formatLabel(k)} placement="top" arrow>
                <Paper
                  component="button"
                  onClick={() => update('iconType', k)}
                  sx={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '1.5px solid',
                    borderColor: activeIconKey === k ? 'primary.main' : 'divider',
                    bgcolor: activeIconKey === k ? 'action.selected' : 'background.paper',
                    borderRadius: 1.5, transition: 'all 0.1s',
                    '&:hover': { borderColor: 'primary.main', transform: 'scale(1.1)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 16, height: 16,
                      color: activeIconKey === k ? 'primary.main' : 'text.secondary',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      '& svg': { width: '100%', height: '100%' },
                    }}
                    dangerouslySetInnerHTML={{ __html: data.svg }}
                  />
                </Paper>
              </Tooltip>
            ))}
          </Box>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Paper
            variant="outlined"
            sx={{
              p: 4, borderStyle: 'dashed', borderColor: 'divider',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 1, position: 'relative',
              '&:hover': { bgcolor: 'background.neutral', borderColor: 'primary.main' },
            }}
          >
            <input
              type="file"
              accept=".svg,.png"
              onChange={onFileUpload}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
            <CloudUploadIcon color="disabled" sx={{ fontSize: 32 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
              UPLOAD ASSET (SVG / PNG)
            </Typography>
          </Paper>

          {(config.customIconUrl || config.customSvgContent) && (
            <Paper sx={{ p: 1, pl: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light' }}>
              <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 800 }}>
                ✓ ASSET LOADED
              </Typography>
              <IconButton size="small" color="error" onClick={() => { update('customIconUrl', ''); update('customSvgContent', ''); }}>
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Paper>
          )}
        </Stack>
      )}

      {/* Icon scale */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary' }}>Icon Scale</Typography>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main' }}>{Number(config.iconScale) || 1}x</Typography>
        </Box>
        <Slider
          size="small"
          min={0.1} max={3} step={0.1}
          value={Number(config.iconScale) || 1}
          onChange={(_, v) => update('iconScale', v)}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};

export default IconTab;
