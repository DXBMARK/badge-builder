/*
 * Project: SVG Badge Builder
 * Author: DXBMARK LLC
 * Purpose: Workspace Data Management (Import/Export)
 */

import React, { useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider, IconButton,
  Stack, Card, CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { downloadJSON } from '../utils/export';

const WorkspaceModal = ({ open, onClose, config, customPresets, customBrands, onRestoreWorkspace }) => {
  const fileInputRef = useRef(null);

  const handleExportWorkspace = () => {
    const payload = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      workspace: {
        config,
        customPresets,
        customBrands
      }
    };
    downloadJSON(payload, 'badge-builder-workspace.json');
  };

  const handleExportPresets = () => {
    downloadJSON(customPresets, 'badge-presets.json');
  };

  const handleExportBrands = () => {
    downloadJSON(customBrands, 'badge-brand-kits.json');
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        
        // Validation check
        if (data.workspace) {
          // Full workspace restore
          onRestoreWorkspace(data.workspace);
        } else {
          alert('Invalid Workspace file structure or version mismatch.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudDownloadIcon color="primary" fontSize="small" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 900, flexGrow: 1 }}>
          Data Management
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ ml: 'auto' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Because Badge Builder Pro runs completely in your browser without a backend or server database, your custom Presets and Brand Kits are saved to your local storage. To migrate your setup or share it, you can export and import your full Workspace.
        </Typography>

        <Stack spacing={2}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Full Workspace Backup</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Includes current badge, custom presets, and brand kits.</Typography>
                </Box>
                <Button size="small" variant="contained" onClick={handleExportWorkspace} sx={{ fontWeight: 800 }}>
                  Download
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Export Presets Only</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Export local preset vault.</Typography>
                </Box>
                <Button size="small" variant="outlined" onClick={handleExportPresets} sx={{ fontWeight: 800 }}>
                  Export
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Restore Workspace</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Import a previously saved `.json` workspace.</Typography>
                  <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>Warning: This will overwrite your local storage.</Typography>
                </Box>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="warning" 
                  startIcon={<CloudUploadIcon />} 
                  sx={{ fontWeight: 800 }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Import File
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImportFileChange}
        />

      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button size="small" variant="text" onClick={onClose} sx={{ fontWeight: 800, fontSize: '0.7rem' }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkspaceModal;