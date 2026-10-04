/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Presets Management Tab
 * Notes: 3-column grid, BrandTab-matching style, search inline with Save button.
 */

import React from 'react';
import { 
  Box, Typography, Button, Divider, IconButton, Paper,
  Grid, TextField, InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { BASE_PRESETS } from '../../constants/presets';
import { buildSVG } from '../../utils/svgBuilder';
import { useNameDialog } from '../ui/NameDialog';

const cloneConfig = (config) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(config);
  }

  return JSON.parse(JSON.stringify(config));
};

const PresetCard = ({ preset, onApply, onDelete, isCustom = false }) => {
  // Scale SVG to fill container width, preserve viewBox aspect ratio
  const svgPreview = React.useMemo(() => {
    const raw = buildSVG(preset.config).svg;

    return raw.replace(
      /<svg /,
      '<svg preserveAspectRatio="xMidYMid meet" '
    );
  }, [preset.config]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        transition: 'all 0.15s',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        minHeight: 128,
      }}
    >
      {/* SVG Preview — fixed 28px height container, SVG scales inside */}
      <Box sx={{
        height: 44,
        bgcolor: 'background.neutral',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 0.75,
        '& svg': {
          display: 'block',
          maxWidth: '100%',
          maxHeight: 34,
          width: 'auto',
          height: 'auto',
          flexShrink: 0,
        },
      }}>
        <Box
          sx={{
            lineHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: svgPreview }}
        />
      </Box>

      {/* Name & category — matching BrandCard typography */}
      <Box>
        <Typography sx={{ fontWeight: 900, color: 'primary.main', textTransform: 'uppercase', fontSize: '0.5rem', letterSpacing: '0.07em', lineHeight: 1.4 }}>
          {preset.category}
        </Typography>
        <Typography sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.65rem', lineHeight: 1.2 }}>
          {preset.name || preset.id}
        </Typography>
      </Box>

      {/* Apply button — identical style to BrandCard's Apply Brand */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={() => onApply(cloneConfig(preset.config))}
          sx={{ py: 0.35, fontSize: '0.6rem', fontWeight: 700, borderRadius: 1.5, lineHeight: 1.4 }}
        >
          Apply
        </Button>
        {isCustom && (
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(preset.id)}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 0.4 }}
          >
            <DeleteIcon sx={{ fontSize: 13 }} />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

const PresetsTab = ({ setConfig, customPresets, savePreset, deletePreset }) => {
  const [search, setSearch] = React.useState('');
  const [nameDialog, askName] = useNameDialog();

  const filteredPresets = React.useMemo(() =>
    BASE_PRESETS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const customList = React.useMemo(() =>
    Object.keys(customPresets).map(name => ({
      id: name, name, category: 'custom', config: customPresets[name]
    })),
    [customPresets]
  );

  return (
    <Box sx={{ p: 1 }}>
      {nameDialog}
      {/* Top row: Save button + Search inline */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon sx={{ fontSize: 14 }} />}
          onClick={async () => {
            const name = await askName('Save preset', 'Preset name');
            if (name) savePreset(name);
          }}
          sx={{ py: 0.9, px: 1.5, borderRadius: 2.5, fontWeight: 800, flexShrink: 0, fontSize: '0.6rem', boxShadow: '0 4px 12px rgba(249,126,26,0.25)', whiteSpace: 'nowrap' }}
        >
          Save Preset
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2.5, bgcolor: 'background.neutral', fontSize: '0.75rem' },
          } }}
        />
      </Box>

      {/* Custom presets */}
      {customList.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.6rem' }}>
            My Library ({customList.length})
          </Typography>
          <Grid container spacing={1.5}>
            {customList.map(p => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                <PresetCard preset={p} onApply={setConfig} onDelete={deletePreset} isCustom />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      {/* Standard Library */}
      <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.6rem' }}>
        Standard Library ({filteredPresets.length})
      </Typography>
      <Grid container spacing={1.5}>
        {filteredPresets.map(p => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
            <PresetCard preset={p} onApply={setConfig} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PresetsTab;
