/*
 * Project: Badge Builder Pro
 * Purpose: In-app replacement for window.prompt() (name a preset, brand kit or pack).
 */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

/**
 * Returns [dialog, ask]. Call ask(title, label) to open the dialog; it resolves
 * with the trimmed name, or null when cancelled.
 */
export const useNameDialog = () => {
  const [state, setState] = React.useState({ open: false, title: '', label: '' });
  const [value, setValue] = React.useState('');
  const resolver = React.useRef(null);

  const ask = React.useCallback((title, label = 'Name') => new Promise((resolve) => {
    resolver.current = resolve;
    setValue('');
    setState({ open: true, title, label });
  }), []);

  const close = (result) => {
    setState((s) => ({ ...s, open: false }));
    if (resolver.current) resolver.current(result);
    resolver.current = null;
  };

  const submit = () => {
    const name = value.trim().slice(0, 60);
    close(name || null);
  };

  const dialog = (
    <Dialog open={state.open} onClose={() => close(null)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>{state.title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label={state.label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
          slotProps={{ htmlInput: { maxLength: 60 } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => close(null)} color="inherit">Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={!value.trim()}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  return [dialog, ask];
};

export default useNameDialog;
