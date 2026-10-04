/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Layout Customization Tab
 * Notes: Follow TS conventions.
 */

import { Box, Typography, Divider, Switch, FormControlLabel } from '@mui/material';
import InputField from '../ui/InputField';

/**
 * [TS] Controls for dimensions and geometry.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const LayoutTab = ({ config, update }) => (
  <Box sx={{ p: 1 }}>
    {/* ── Smart Features ───── */}
    <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={config.autoWidth !== false} // Default to true
            onChange={e => update('autoWidth', e.target.checked)}
          />
        }
        label={<Typography variant="caption" sx={{ fontWeight: 800, color: config.autoWidth !== false ? 'primary.main' : 'text.disabled' }}>AUTO FIT WIDTH</Typography>}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={config.smartAlign !== false} // Default to true
            onChange={e => update('smartAlign', e.target.checked)}
          />
        }
        label={<Typography variant="caption" sx={{ fontWeight: 800, color: config.smartAlign !== false ? 'primary.main' : 'text.disabled' }}>SMART ALIGNMENT</Typography>}
      />
    </Box>

    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, opacity: config.autoWidth !== false ? 0.5 : 1, pointerEvents: config.autoWidth !== false ? 'none' : 'auto' }}>
      <Box>
        <InputField label="Total Width" type="number" value={config.width} onChange={v => update('width', v)} />
      </Box>
      <Box>
        <InputField label="Total Height" type="number" value={config.height} onChange={v => update('height', v)} />
      </Box>
      <Box>
        <InputField label="Split Ratio" type="number" value={config.leftWidth} onChange={v => update('leftWidth', v)} />
      </Box>
    </Box>

    <Divider sx={{ my: 3 }} />

    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
      Precise Positioning (Drag or Edit)
    </Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {/* Label Position */}
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 800, color: 'text.secondary' }}>LABEL POS</Typography>
        <InputField label="X Offset" type="number" value={config.leftAlign || 0} onChange={v => update('leftAlign', v)} sx={{ mb: 1 }} />
        <InputField label="Y Offset" type="number" value={config.leftAlignY || 0} onChange={v => update('leftAlignY', v)} sx={{ mb: 0 }} />
      </Box>

      {/* Value Position */}
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 800, color: 'text.secondary' }}>VALUE POS</Typography>
        <InputField label="X Offset" type="number" value={config.rightAlign || 0} onChange={v => update('rightAlign', v)} sx={{ mb: 1 }} />
        <InputField label="Y Offset" type="number" value={config.rightAlignY || 0} onChange={v => update('rightAlignY', v)} sx={{ mb: 0 }} />
      </Box>

      {/* Icon Position */}
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', opacity: config.smartAlign !== false ? 0.5 : 1 }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 800, color: 'text.secondary' }}>ICON POS</Typography>
        <InputField label="X Offset" type="number" value={config.iconX || 0} onChange={v => update('iconX', v)} sx={{ mb: 1 }} disabled={config.smartAlign !== false} />
        <InputField label="Y Offset" type="number" value={config.iconY !== undefined ? config.iconY : 0} onChange={v => update('iconY', v)} sx={{ mb: 0 }} disabled={config.smartAlign !== false} />
      </Box>
    </Box>
  </Box>
);

export default LayoutTab;
