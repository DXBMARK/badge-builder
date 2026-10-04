/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Input Field Component
 * Notes: Follow TS conventions.
 */

import { TextField, Box } from '@mui/material';

/**
 * [TS] MUI-based input field.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const InputField = ({ label, type = "text", value, onChange, ...props }) => (
  <Box sx={{ mb: 2 }}>
    <TextField
      fullWidth
      label={label.toUpperCase()}
      type={type}
      value={value ?? (type === 'number' ? 0 : '')}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        inputLabel: {
          shrink: true,
          sx: { 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            color: 'text.secondary'
          }
        },
        htmlInput: {
          sx: { fontSize: '0.875rem' }
        }
      }}
      {...props}
    />
  </Box>
);

export default InputField;
