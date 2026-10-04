/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: Build Diagnostics Panel
 * Notes: Shows real-time build health. Checks conform to Shields.io,
 *        GitHub Markdown rendering, and WCAG AA contrast standards.
 */

import { Paper, Box, Typography, Tooltip } from '@mui/material';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import StatusBadge from './ui/StatusBadge';

/**
 * [TS] Real-time build health panel.
 * Each check carries its own message and suggestion — no static lookup needed.
 * @param {{ results: import('../core/diagnostics').DiagnosticCheck[] }} props
 */
const DiagnosticsPanel = ({ results }) => (
  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TroubleshootIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1, letterSpacing: '0.1em' }}>
          Build Diagnostics
        </Typography>
      </Box>
      <Tooltip
        title="Real-time health checks — Shields.io dimensions, GitHub Markdown compatibility, and WCAG AA contrast. All PASS means your badge is production-ready."
        placement="top"
        arrow
      >
        <HelpOutlineIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }} />
      </Tooltip>
    </Box>

    {/* Status chips */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {results.map((check) => (
        <Tooltip
          key={check.id}
          title={
            check.suggestion
              ? `${check.message} — ${check.suggestion}`
              : check.message
          }
          placement="top"
          arrow
        >
          <span>
            <StatusBadge label={check.name} status={check.status} />
          </span>
        </Tooltip>
      ))}
    </Box>

    {/* Footer hint */}
    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', fontSize: '0.7rem', fontStyle: 'italic' }}>
      Hover each indicator for details. Shields.io · GitHub · WCAG AA.
    </Typography>
  </Paper>
);

export default DiagnosticsPanel;
