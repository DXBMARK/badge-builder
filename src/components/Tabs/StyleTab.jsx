/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Style Customization Tab
 * Notes: Fixed Outline & Border section design. Shields.io compliant colors.
 */

import { Box, Typography, Switch, FormControlLabel, Divider, Slider, Tooltip } from '@mui/material';
import InputField from '../ui/InputField';

/**
 * [TS] Helper to render a color field with a visible label and swatch.
 */
const ColorField = ({ label, value, onChange }) => {
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value) || value === 'transparent' || value === 'none';

  const handleChange = (val) => {
    let cleanVal = val.trim();
    if (cleanVal.length > 0 && !cleanVal.startsWith('#') && cleanVal.match(/^[0-9A-F]{3,6}$/i)) {
      cleanVal = `#${cleanVal}`;
    }
    onChange(cleanVal);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* 🎨 Color swatch that opens the native picker */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: isValidHex ? value : '#000000',
            border: '2px solid',
            borderColor: isValidHex ? 'divider' : 'error.main',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
            '&:hover': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(33,43,54,0.08)' },
            transition: 'all 0.2s',
          }}
        >
          <input
            type="color"
            value={isValidHex && value.startsWith('#') ? value : '#000000'}
            onChange={e => onChange(e.target.value)}
            style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />
        </Box>
        {/* Hex code text input */}
        <Tooltip title={!isValidHex ? "Invalid Hex Color" : ""} placement="top" arrow>
          <Box sx={{ flex: 1 }}>
            <InputField
              label=""
              value={value}
              onChange={handleChange}
              error={!isValidHex}
              sx={{ mb: 0, width: '100%', '& .MuiInputBase-root': { height: 36, fontSize: '0.8rem', fontFamily: '"Fira Code", monospace', letterSpacing: '0.05em' } }}
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

/**
 * [TS] Section header component.
 */
const SectionHeader = ({ title, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    {icon && <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>}
    <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '0.1em', lineHeight: 1 }}>
      {title}
    </Typography>
  </Box>
);

/**
 * [TS] Controls for colors, gradients, and aesthetic effects.
 * Follows Shields.io badge color standards.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const StyleTab = ({ config, update }) => (
  <Box sx={{ p: 1 }}>

    {/* ── Background & Text ─────────────────── */}
    <SectionHeader title="Background & Text" />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
      <ColorField label="Label BG" value={config.leftBg} onChange={v => update('leftBg', v)} />
      <ColorField label="Value BG" value={config.rightBg} onChange={v => update('rightBg', v)} />
      <ColorField label="Label Text" value={config.leftTextColor} onChange={v => update('leftTextColor', v)} />
      <ColorField label="Value Text" value={config.rightTextColor} onChange={v => update('rightTextColor', v)} />
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* ── Gradient – Shields.io style ───────── */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
      <SectionHeader title="Gradient Effect" />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={config.useGradient}
            onChange={e => update('useGradient', e.target.checked)}
          />
        }
        label={<Typography variant="caption" sx={{ fontWeight: 800, color: config.useGradient ? 'primary.main' : 'text.disabled' }}>ENABLE</Typography>}
        labelPlacement="start"
        sx={{ m: 0 }}
      />
    </Box>

    {config.useGradient && (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mt: 0.5 }}>
        <ColorField label="Start Color" value={config.gradStart} onChange={v => update('gradStart', v)} />
        <ColorField label="End Color" value={config.gradEnd} onChange={v => update('gradEnd', v)} />
      </Box>
    )}

    <Divider sx={{ my: 2 }} />

    {/* ── Shape & Outline ───── */}
    <SectionHeader title="Shape & Outline" />

    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 0.5 }}>
      {/* Border Radius */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
            Radius
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: '"Fira Code", monospace', fontWeight: 800, color: 'primary.main', fontSize: '0.7rem' }}>
            {Number(config.borderRadius).toFixed(1)}px
          </Typography>
        </Box>
        <Slider
          size="small"
          min={0}
          max={30}
          step={1}
          value={Number(config.borderRadius) || 0}
          onChange={(_, v) => update('borderRadius', v)}
          sx={{ color: config.borderRadius > 0 ? 'primary.main' : 'text.disabled', py: 1 }}
        />
      </Box>

      {/* Outline Width */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
            Outline
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: '"Fira Code", monospace', fontWeight: 800, color: 'primary.main', fontSize: '0.7rem' }}>
            {(Number(config.outlineWidth) || 0).toFixed(1)}px
          </Typography>
        </Box>
        <Slider
          size="small"
          min={0}
          max={10}
          step={0.5}
          value={Number(config.outlineWidth) || 0}
          onChange={(_, v) => update('outlineWidth', v)}
          sx={{ color: config.outlineWidth > 0 ? 'primary.main' : 'text.disabled', py: 1 }}
        />
      </Box>
    </Box>

    {/* Outline Color */}
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
      <ColorField label="Outline Color" value={config.outlineColor || '#d0d7de'} onChange={v => update('outlineColor', v)} />
    </Box>

  </Box>
);

export default StyleTab;
