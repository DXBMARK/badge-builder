/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Status Badge Component
 * Notes: Supports three states — PASS, WARNING, FAIL.
 */

import React from 'react';
import { Chip, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';

const STATUS_STYLES = {
  PASS: {
    bgcolor: 'rgba(0, 171, 85, 0.08)',
    color: '#007B55',
    borderColor: 'rgba(0, 171, 85, 0.24)',
    icon: <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#00AB55 !important' }} />,
    label: 'PASS',
  },
  WARNING: {
    bgcolor: 'rgba(255, 171, 0, 0.08)',
    color: '#B76E00',
    borderColor: 'rgba(255, 171, 0, 0.32)',
    icon: <WarningAmberIcon sx={{ fontSize: '14px !important', color: '#FFAB00 !important' }} />,
    label: 'WARN',
  },
  FAIL: {
    bgcolor: 'rgba(255, 72, 66, 0.08)',
    color: '#B71D18',
    borderColor: 'rgba(255, 72, 66, 0.24)',
    icon: <ErrorIcon sx={{ fontSize: '14px !important', color: '#FF4842 !important' }} />,
    label: 'FAIL',
  },
};

/**
 * [TS] MUI-based status chip with PASS / WARNING / FAIL states.
 * Accepts either `status` ('PASS'|'WARNING'|'FAIL') or legacy `pass` boolean.
 */
const StatusBadge = ({ label, status, pass }) => {
  const resolvedStatus = status ?? (pass ? 'PASS' : 'FAIL');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const base = STATUS_STYLES[resolvedStatus] ?? STATUS_STYLES.FAIL;
  const DARK_TEXT = { PASS: '#6EE7B7', WARNING: '#FCD34D', FAIL: '#FCA5A5' };
  // Higher-contrast text on dark backgrounds (WCAG AA).
  const style = isDark ? { ...base, color: DARK_TEXT[resolvedStatus] ?? DARK_TEXT.FAIL, bgcolor: base.bgcolor.replace('0.08', '0.16') } : base;

  return (
    <Chip
      label={`${label}: ${style.label}`}
      size="small"
      icon={style.icon}
      sx={{
        fontWeight: 700,
        fontSize: '0.625rem',
        letterSpacing: '0.04em',
        bgcolor: style.bgcolor,
        color: style.color,
        border: '1px solid',
        borderColor: style.borderColor,
        borderRadius: 1,
        '& .MuiChip-icon': { color: 'inherit' },
      }}
    />
  );
};

export default StatusBadge;
