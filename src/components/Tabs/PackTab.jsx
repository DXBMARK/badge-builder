/*
 * Project: Badge Builder Pro
 * Author: [TS]
 * Purpose: Pack Builder Tab — Full Phase 7 implementation
 * Notes: Design aligned with BrandTab. Supports Local, External, Preset item types.
 */

import { useNameDialog } from '../ui/NameDialog';
import { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Paper, Stack, IconButton, Tooltip, Grid,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CollectionsIcon from '@mui/icons-material/Collections';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import { BUILT_IN_PACKS, INPUT_LABELS, resolveTemplate } from '../../constants/packs';
import { normalizePresetConfig } from '../../constants/presets';
import { buildSVG } from '../../utils/svgBuilder';
import { downloadJSON } from '../../utils/export';

// ─── Constants ──────────────────────────────────────────────────────────────
const STORAGE_CURRENT = 'bbp.currentPack';
const STORAGE_SAVED   = 'bbp.savedPacks';

const BRAND_KEYS = ['leftBg', 'rightBg', 'leftTextColor', 'rightTextColor',
  'fontFamily', 'borderRadius', 'outlineWidth', 'outlineColor',
  'useGradient', 'gradStart', 'gradEnd'];

// ─── PackCard (Built-in) ─────────────────────────────────────────────────────
const PackCard = ({ pack, onLoad }) => (
  <Paper
    variant="outlined"
    sx={{ p: 1.5, borderRadius: 2.5, '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}
  >
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>{pack.name}</Typography>
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.55rem' }}>
        {pack.items.length} badges{pack.requiredInputs?.length ? ' · requires inputs' : ''}
      </Typography>
    </Box>

    {/* Badge preview row — local items only */}
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', mb: 1, minHeight: 18 }}>
      {pack.items.filter(i => i.kind === 'local').slice(0, 3).map((item, idx) => {
        const svgData = buildSVG(normalizePresetConfig(item.config));
        return (
          <Box key={idx} dangerouslySetInnerHTML={{ __html: svgData.svg }}
            sx={{ '& svg': { maxHeight: 16, width: 'auto' }, opacity: 0.85 }}
          />
        );
      })}
      {pack.items.filter(i => i.kind === 'external').length > 0 && (
        <Chip label="+ ext" size="small" sx={{ height: 14, fontSize: '0.5rem', px: 0.5 }} />
      )}
    </Stack>

    <Button fullWidth variant="contained" size="small" startIcon={<CollectionsIcon />}
      onClick={() => onLoad(pack)}
      sx={{ py: 0.35, borderRadius: 1.5, fontWeight: 700, fontSize: '0.6rem', lineHeight: 1.4 }}
    >
      Load Pack
    </Button>
  </Paper>
);

// ─── Item Row ────────────────────────────────────────────────────────────────
const ItemRow = ({ item, index, total, onMoveUp, onMoveDown, onDuplicate, onRemove, onEdit }) => {
  const isLocal = item.kind === 'local';
  const svgData = isLocal ? buildSVG(item.config) : null;
  const label = isLocal
    ? [item.config.leftText, item.config.rightText].filter(Boolean).join(' | ') || 'Badge'
    : item.label || 'External';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1 }}>
      {/* Left: number + preview + label */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0, flex: 1, overflow: 'hidden' }}>
        <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', fontSize: '0.6rem', width: 14, flexShrink: 0 }}>
          {index + 1}
        </Typography>

        {isLocal ? (
          <Box dangerouslySetInnerHTML={{ __html: svgData.svg }}
            sx={{ '& svg': { maxHeight: 20, width: 'auto' }, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          />
        ) : (
          <Chip label="EXT" size="small" color="info" sx={{ height: 16, fontSize: '0.5rem', fontWeight: 800, flexShrink: 0 }} />
        )}

        <Stack sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.62rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label}
          </Typography>
          <Chip
            label={isLocal ? 'Local' : 'External'}
            size="small"
            sx={{ height: 12, fontSize: '0.48rem', fontWeight: 800, width: 'fit-content',
              bgcolor: isLocal ? 'action.selected' : 'info.main',
              color: isLocal ? 'text.secondary' : 'info.contrastText' }}
          />
        </Stack>
      </Stack>

      {/* Right: actions */}
      <Stack direction="row" spacing={0.25} flexShrink={0}>
        {isLocal && (
          <Tooltip title="Edit in editor">
            <IconButton size="small" onClick={() => onEdit(item.config)} sx={{ p: 0.5 }}>
              <EditIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Duplicate">
          <IconButton size="small" onClick={() => onDuplicate(index)} sx={{ p: 0.5 }}>
            <FileCopyIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Move Up">
          <span>
            <IconButton size="small" disabled={index === 0} onClick={() => onMoveUp(index)} sx={{ p: 0.5 }}>
              <ArrowUpwardIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Move Down">
          <span>
            <IconButton size="small" disabled={index === total - 1} onClick={() => onMoveDown(index)} sx={{ p: 0.5 }}>
              <ArrowDownwardIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Remove">
          <IconButton size="small" color="error" onClick={() => onRemove(item._packId)} sx={{ p: 0.5 }}>
            <DeleteIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

// ─── Main Tab ─────────────────────────────────────────────────────────────────
const PackTab = ({ config, onCopy, onLoadBadge }) => {
  const [nameDialog, askName] = useNameDialog();
  const [pack, setPack] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });
  const [loadModal, setLoadModal] = useState(null); // { pack, inputs: {} }
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [outputMode, setOutputMode] = useState('inline');
  const fileInputRef = useRef(null);

  // ── Persist / restore current pack ──────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(STORAGE_CURRENT, JSON.stringify(pack)); } catch { /* storage unavailable */ }
  }, [pack]);

  // ── Pack mutations ───────────────────────────────────────────────────────
  const addToPack = () =>
    setPack(prev => [...prev, { _packId: Date.now(), kind: 'local', config: JSON.parse(JSON.stringify(config)), label: [config.leftText, config.rightText].filter(Boolean).join(' | ') || 'Badge' }]);

  const removeFromPack = (id) => setPack(prev => prev.filter(b => b._packId !== id));

  const moveUp = (index) => {
    const next = [...pack];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setPack(next);
  };

  const moveDown = (index) => {
    const next = [...pack];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setPack(next);
  };

  const duplicate = (index) =>
    setPack(prev => {
      const copy = { ...prev[index], _packId: Date.now() };
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });

  const applyBrand = () => {
    const brandSlice = Object.fromEntries(BRAND_KEYS.map(k => [k, config[k]]).filter(([, v]) => v !== undefined));
    setPack(prev => prev.map(item =>
      item.kind === 'local' ? { ...item, config: { ...item.config, ...brandSlice } } : item
    ));
    onCopy('', 'Brand Applied to Pack');
  };

  // ── Output generators ────────────────────────────────────────────────────
  const getMarkdownForItem = (item) => {
    if (item.kind === 'external') return item.markdown || item.markdownTemplate || '';
    const label = item.config.leftText || 'Badge';
    const value = item.config.rightText || 'Value';
    const color = (item.config.rightBg || '#4c1').replace('#', '');
    return `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color})`;
  };

  const copyOutput = () => {
    if (!pack.length) return;
    const mds = pack.map(getMarkdownForItem);
    let output = '';
    if (outputMode === 'inline')   output = mds.join(' ');
    if (outputMode === 'stacked')  output = mds.join('\n');
    if (outputMode === 'html')     output = pack.map(item => {
      if (item.kind === 'external') return `<!-- ${item.label || 'External'}: use markdown link -->`;
      const svgData = buildSVG(item.config);
      const b64 = btoa(unescape(encodeURIComponent(svgData.svg)));
      const alt = item.config.leftText || 'Badge';
      return `<img src="data:image/svg+xml;base64,${b64}" alt="${alt}" />`;
    }).join('');
    if (outputMode === 'table')    output = `| Label | Badge |\n|---|---|\n` + pack.map(item => `| ${item.label || item.config?.leftText || 'Badge'} | ${getMarkdownForItem(item)} |`).join('\n');
    onCopy(output, 'Pack Output');
  };

  // ── Save / Export / Import ────────────────────────────────────────────────
  const savePack = async () => {
    const name = await askName('Save pack', 'Pack name');
    if (!name) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_SAVED) || '{}');
      saved[name] = pack;
      localStorage.setItem(STORAGE_SAVED, JSON.stringify(saved));
      onCopy('', `Pack "${name}" Saved`);
    } catch { /* storage unavailable */ }
  };

  const exportPack = () => downloadJSON({ name: 'Custom Pack', items: pack }, 'badge-pack.json');

  const importPack = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data.items)) {
          const hydrated = data.items.map((item, i) => ({ ...item, _packId: Date.now() + i }));
          setPack(hydrated);
          onCopy('', 'Pack Imported');
        }
      } catch { onCopy('', 'Import Failed'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Built-in Pack loading ─────────────────────────────────────────────────
  const handleBuiltInLoad = (builtIn) => {
    if (builtIn.requiredInputs?.length) {
      setLoadModal({ pack: builtIn, inputs: Object.fromEntries(builtIn.requiredInputs.map(k => [k, ''])) });
    } else {
      hydratePack(builtIn, {});
    }
  };

  const hydratePack = (builtIn, inputs) => {
    const hydrated = builtIn.items.map((item, i) => ({
      _packId: Date.now() + i,
      kind: item.kind,
      label: item.kind === 'local'
        ? [item.config.leftText, item.config.rightText].filter(Boolean).join(' | ')
        : item.label || 'External',
      ...(item.kind === 'local'
        ? { config: normalizePresetConfig(item.config) }
        : { markdown: resolveTemplate(item.markdownTemplate, inputs), markdownTemplate: item.markdownTemplate }
      ),
    }));
    setPack(hydrated);
    setLoadModal(null);
  };

  return (
    <Box sx={{ p: 1 }}>
      {nameDialog}
      {/* Primary Action */}
      <Button fullWidth variant="contained" size="large" startIcon={<CollectionsIcon />}
        onClick={addToPack}
        sx={{ mb: 2.5, py: 1, borderRadius: 2.5, fontWeight: 800, boxShadow: '0 4px 12px rgba(249,126,26,0.25)' }}
      >
        Add Current Badge to Pack
      </Button>

      {/* Active Pack */}
      {pack.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          {/* Pack header bar */}
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.6rem' }}>
              Current Pack · {pack.length} {pack.length === 1 ? 'badge' : 'badges'}
            </Typography>
            <Button size="small" color="error" onClick={() => setClearConfirmOpen(true)}
              sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35, px: 1, minWidth: 0 }}>
              Clear
            </Button>
          </Stack>

          {/* Item list */}
          <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden', mb: 1.5 }}>
            <Stack divider={<Box sx={{ height: '1px', bgcolor: 'divider' }} />}>
              {pack.map((item, idx) => (
                <ItemRow
                  key={item._packId}
                  item={item}
                  index={idx}
                  total={pack.length}
                  onMoveUp={moveUp}
                  onMoveDown={moveDown}
                  onDuplicate={duplicate}
                  onRemove={removeFromPack}
                  onEdit={onLoadBadge}
                />
              ))}
            </Stack>
          </Paper>

          {/* Output mode + copy */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <Select
                value={outputMode}
                onChange={e => setOutputMode(e.target.value)}
                sx={{ fontSize: '0.62rem', fontWeight: 700, height: 28, '& .MuiSelect-select': { py: 0.5 } }}
              >
                <MenuItem value="inline"  sx={{ fontSize: '0.65rem' }}>Inline MD</MenuItem>
                <MenuItem value="stacked" sx={{ fontSize: '0.65rem' }}>Stacked MD</MenuItem>
                <MenuItem value="html"    sx={{ fontSize: '0.65rem' }}>HTML</MenuItem>
                <MenuItem value="table"   sx={{ fontSize: '0.65rem' }}>Table MD</MenuItem>
              </Select>
            </FormControl>
            <Button size="small" variant="outlined" startIcon={<ContentCopyIcon sx={{ fontSize: '0.75rem !important' }} />}
              onClick={copyOutput}
              sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35, flex: 1 }}>
              Copy Output
            </Button>
          </Stack>

          {/* Pack-level actions */}
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Tooltip title="Apply current brand colors to all local badges">
              <Button size="small" variant="outlined" startIcon={<ColorLensIcon sx={{ fontSize: '0.75rem !important' }} />}
                onClick={applyBrand}
                sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35 }}>
                Apply Brand
              </Button>
            </Tooltip>
            <Tooltip title="Save this pack to browser storage">
              <Button size="small" variant="outlined" startIcon={<SaveIcon sx={{ fontSize: '0.75rem !important' }} />}
                onClick={savePack}
                sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35 }}>
                Save Pack
              </Button>
            </Tooltip>
            <Tooltip title="Export pack as JSON file">
              <Button size="small" variant="outlined" startIcon={<FileDownloadIcon sx={{ fontSize: '0.75rem !important' }} />}
                onClick={exportPack}
                sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35 }}>
                Export JSON
              </Button>
            </Tooltip>
            <Tooltip title="Import pack from JSON file">
              <Button size="small" variant="outlined" startIcon={<FileUploadIcon sx={{ fontSize: '0.75rem !important' }} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ fontWeight: 800, fontSize: '0.6rem', py: 0.35 }}>
                Import JSON
              </Button>
            </Tooltip>
          </Stack>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importPack} />
        </Box>
      ) : (
        /* Empty state */
        <Paper variant="outlined" sx={{ borderRadius: 2.5, py: 3, mb: 2, textAlign: 'center' }}>
          <CollectionsIcon sx={{ fontSize: 28, color: 'text.disabled', mb: 0.5 }} />
          <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', fontWeight: 700, fontSize: '0.65rem' }}>
            Your pack is empty
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', fontSize: '0.58rem' }}>
            Add the current badge or load a built-in pack below
          </Typography>
        </Paper>
      )}

      {/* Built-in Packs */}
      <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.6rem' }}>
        Built-in Packs
      </Typography>
      <Grid container spacing={1.5}>
        {BUILT_IN_PACKS.map(builtin => (
          <Grid size={{ xs: 6 }} key={builtin.id}>
            <PackCard pack={builtin} onLoad={handleBuiltInLoad} />
          </Grid>
        ))}
      </Grid>

      {/* Clear Pack confirmation */}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '0.95rem' }}>Clear Pack?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            This will remove all {pack.length} badge{pack.length !== 1 ? 's' : ''} from the current pack. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setClearConfirmOpen(false)} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => { setPack([]); setClearConfirmOpen(false); }}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Built-in Pack inputs modal */}
      <Dialog open={!!loadModal} onClose={() => setLoadModal(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '0.95rem', pb: 1 }}>
          {loadModal?.pack.name}
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 400, mt: 0.5 }}>
            {loadModal?.pack.description}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 0.5 }}>
            {loadModal?.pack.requiredInputs.map(key => (
              <TextField
                key={key}
                label={INPUT_LABELS[key] || key}
                size="small"
                fullWidth
                value={loadModal.inputs[key] || ''}
                onChange={e => setLoadModal(prev => ({ ...prev, inputs: { ...prev.inputs, [key]: e.target.value } }))}
                sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' }, '& label': { fontSize: '0.8rem' } }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLoadModal(null)} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Cancel</Button>
          <Button variant="contained" onClick={() => hydratePack(loadModal.pack, loadModal.inputs)}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
            Generate Pack
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackTab;
