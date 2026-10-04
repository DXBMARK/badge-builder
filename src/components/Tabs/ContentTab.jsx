/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Content Customization Tab
 * Notes: Expanded fonts and independent weight controls.
 */

import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import InputField from '../ui/InputField';

const FONT_FAMILIES = [
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Space Grotesk, sans-serif', label: 'Space Grotesk' },
  { value: 'Fira Code, monospace', label: 'Fira Code' },
  { value: 'DM Sans, sans-serif', label: 'DM Sans' },
  { value: 'Plus Jakarta Sans, sans-serif', label: 'Plus Jakarta Sans' },
  { value: 'Nunito, sans-serif', label: 'Nunito' },
  { value: 'Raleway, sans-serif', label: 'Raleway' },
];

const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi-Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra-Bold' },
  { value: '900', label: 'Black' },
];

/**
 * [TS] Controls for text labels, sizes, fonts, and weights.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ContentTab = ({ config, update }) => (
  <Box sx={{ p: 1 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
      <Box>
        <InputField label="Label Text" value={config.leftText} onChange={v => update('leftText', v)} />
      </Box>
      <Box>
        <InputField label="Value Text" value={config.rightText} onChange={v => update('rightText', v)} />
      </Box>

      <Box>
        <InputField label="Label Size" type="number" value={config.leftFontSize} onChange={v => update('leftFontSize', v)} />
      </Box>
      <Box>
        <InputField label="Value Size" type="number" value={config.rightFontSize} onChange={v => update('rightFontSize', v)} />
      </Box>

      <Box sx={{ gridColumn: 'span 2' }}>
        <FormControl fullWidth size="small">
          <InputLabel shrink sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Font Family</InputLabel>
          <Select
            value={config.fontFamily}
            onChange={e => update('fontFamily', e.target.value)}
            label="Font Family"
            notched
            sx={{ fontSize: '0.875rem' }}
          >
            {FONT_FAMILIES.map(font => (
              <MenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value, fontSize: '0.875rem' }}>
                {font.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <FormControl fullWidth size="small">
          <InputLabel shrink sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Label Weight</InputLabel>
          <Select
            value={config.leftFontWeight}
            onChange={e => update('leftFontWeight', e.target.value)}
            label="Label Weight"
            notched
            sx={{ fontSize: '0.875rem' }}
          >
            {FONT_WEIGHTS.map(w => (
              <MenuItem key={w.value} value={w.value} sx={{ fontWeight: w.value, fontSize: '0.875rem' }}>
                {w.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <FormControl fullWidth size="small">
          <InputLabel shrink sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Value Weight</InputLabel>
          <Select
            value={config.rightFontWeight}
            onChange={e => update('rightFontWeight', e.target.value)}
            label="Value Weight"
            notched
            sx={{ fontSize: '0.875rem' }}
          >
            {FONT_WEIGHTS.map(w => (
              <MenuItem key={w.value} value={w.value} sx={{ fontWeight: w.value, fontSize: '0.875rem' }}>
                {w.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  </Box>
);

export default ContentTab;
