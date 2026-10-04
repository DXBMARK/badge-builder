/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Bulk Generation Tab
 * Notes: Generates multiple badges for a list of tech/tools.
 */

import React from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Stack, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import { buildSVG } from '../../utils/svgBuilder';
import { downloadSVG } from '../../utils/export';

const hex = (c, fallback) => String(c || fallback).replace('#', '').slice(0, 8);
const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'badge';

const BulkTab = ({ config, onCopy }) => {
  const [list, setList] = React.useState('React, Node.js, Docker, TypeScript, GitHub');
  const items = React.useMemo(() => list.split(',').map(s => s.trim()).filter(Boolean), [list]);

  const generatedBadges = React.useMemo(() => {
    return items.map(item => {
      const badgeConfig = {
        ...config,
        rightText: item
      };
      const { svg } = buildSVG(badgeConfig);
      return {
        name: item,
        svg: svg,
        // Shields.io equivalent of the designed badge (same label, message and colours).
        md: `![${config.leftText || item}](https://img.shields.io/badge/${encodeURIComponent((config.leftText || '').replace(/-/g, '--'))}-${encodeURIComponent(item.replace(/-/g, '--'))}-${hex(config.rightBg, 'F97E1A')}?labelColor=${hex(config.leftBg, '0F172A')})`,
      };
    });
  }, [items, config]);

  const copyAllMarkdown = () => {
    const allMd = generatedBadges.map(b => b.md).join('\n');
    onCopy(allMd, 'All Markdown Badges');
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', mb: 1, display: 'block' }}>
        ENTER ITEMS (COMMA SEPARATED)
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        value={list}
        onChange={(e) => setList(e.target.value)}
        placeholder="e.g. React, Node.js, Python, AWS"
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.neutral' } }}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<AutoFixHighIcon />}
          onClick={copyAllMarkdown}
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Copy All Markdown
        </Button>
      </Stack>

      <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>
        PREVIEW ({generatedBadges.length})
      </Typography>
      
      <Grid container spacing={1.5}>
        {generatedBadges.map((badge, idx) => (
          <Grid size={{ xs: 12, sm: 6 }} key={idx}>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: 'background.neutral' }}>
              <Box sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, transform: 'scale(0.8)' }}>
                <div dangerouslySetInnerHTML={{ __html: badge.svg }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 800, textAlign: 'center', display: 'block', mb: 1 }}>
                {badge.name}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Copy Markdown (Shields.io equivalent)">
                  <IconButton size="small" aria-label={`Copy Markdown for ${badge.name}`} onClick={() => onCopy(badge.md, `Markdown for ${badge.name}`)} sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy SVG code">
                  <IconButton size="small" aria-label={`Copy SVG for ${badge.name}`} onClick={() => onCopy(badge.svg, `SVG for ${badge.name}`)} sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <CodeIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download SVG file">
                  <IconButton size="small" aria-label={`Download SVG for ${badge.name}`} onClick={() => downloadSVG(badge.svg, `${slug(badge.name)}.svg`)} sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <DownloadIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BulkTab;
