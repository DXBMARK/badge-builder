/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Export Dialog Component
 * Notes: Follow TS conventions.
 */

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import VectorIcon from '@mui/icons-material/Gesture';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';

const ExportModal = ({ show, onClose, onExportSVG, onExportPNG, onCopyCode, onCopyMarkdown, onCopyHTML, onExportConfig }) => (
  <Dialog 
    open={show} 
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    slotProps={{ paper: { sx: { borderRadius: 4, p: { xs: 0.25, sm: 1 }, m: { xs: 1, sm: 2 }, width: 'calc(100% - 16px)' } } }}
  >
    <DialogTitle sx={{ m: 0, p: { xs: 1.5, sm: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary' }}>Export Asset</Typography>
      <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
    </DialogTitle>
    <DialogContent sx={{ px: { xs: 1.5, sm: 2 }, pb: 3 }}>
      <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', px: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>Downloads</Typography>
      <List sx={{ pt: 0 }}>
        <ListItemButton onClick={onExportSVG} sx={{ borderRadius: 2, mb: 1, py: 1, border: '1px solid', borderColor: 'divider' }}>
          <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}><VectorIcon /></ListItemIcon>
          <ListItemText primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>SVG Vector</Typography>} secondary={<Typography variant="caption" sx={{ color: 'text.disabled' }}>Scalable Graphic</Typography>} />
          <GetAppIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
        </ListItemButton>

        <ListItemButton onClick={() => onExportPNG(1)} sx={{ borderRadius: 2, mb: 1, py: 1, border: '1px solid', borderColor: 'divider' }}>
          <ListItemIcon sx={{ color: 'secondary.main', minWidth: 40 }}><ImageIcon /></ListItemIcon>
          <ListItemText primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>PNG Raster (1x)</Typography>} secondary={<Typography variant="caption" sx={{ color: 'text.disabled' }}>Standard Resolution</Typography>} />
          <GetAppIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
        </ListItemButton>

        <ListItemButton onClick={() => onExportPNG(2)} sx={{ borderRadius: 2, mb: 1, py: 1, border: '1px solid', borderColor: 'divider' }}>
          <ListItemIcon sx={{ color: 'secondary.main', minWidth: 40 }}><ImageIcon /></ListItemIcon>
          <ListItemText primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>PNG Raster (2x)</Typography>} secondary={<Typography variant="caption" sx={{ color: 'text.disabled' }}>High Definition</Typography>} />
          <GetAppIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
        </ListItemButton>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', px: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>Copy to Clipboard</Typography>

        <ListItemButton onClick={onCopyCode} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><CodeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>SVG Code</Typography>} />
        </ListItemButton>

        <ListItemButton onClick={onCopyMarkdown} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><DescriptionIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Markdown Snippet</Typography>} />
        </ListItemButton>

        <ListItemButton onClick={onCopyHTML} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><CodeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>HTML Snippet</Typography>} />
        </ListItemButton>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', px: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>Configuration</Typography>

        <ListItemButton onClick={onExportConfig} sx={{ borderRadius: 2, bgcolor: 'background.neutral' }}>
          <ListItemIcon sx={{ minWidth: 40 }}><StorageIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Export Badge Config (.json)</Typography>} />
        </ListItemButton>
      </List>
    </DialogContent>
  </Dialog>
);

export default ExportModal;
