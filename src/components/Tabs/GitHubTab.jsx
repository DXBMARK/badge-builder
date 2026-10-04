/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI GitHub URL Generator Tab
 * Notes: Follow TS conventions.
 */

import React from 'react';
import { Box, Typography, Paper, IconButton, Stack, Grid, ToggleButtonGroup, ToggleButton, Button, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputField from '../ui/InputField';

const GitHubTab = ({ context, setContext, onCopy }) => {
  const [mode, setMode] = React.useState('project');
  
  // Extend context defaults if missing
  const ctx = {
    user: 'DXBMark', repo: 'badge-builder', branch: 'main', workflow: 'ci.yml', pkg: 'npm-package', style: 'for-the-badge',
    profileName: 'Tariq', stack: 'react,nodejs,docker', linkedin: 'tariqsaid', portfolio: 'portfolio.dxbmark.com', theme: 'dark',
    ...context
  };

  const update = (key, val) => setContext(p => ({ ...p, [key]: val }));

  // GitHub Actions workflow filename should NOT be double-encoded (path segment, not query value)
  const plain = (v) => (v || '').trim().replace(/\s+/g, '-');

  const generateProjectBadges = () => {
    const user = plain(ctx.user);
    const repo = plain(ctx.repo);
    const branch = plain(ctx.branch);
    const workflow = plain(ctx.workflow);
    const style = plain(ctx.style);

    // Warn if required fields are empty
    if (!user || !repo) return [];

    return [
      { label: 'GitHub Actions CI', md: `![CI](https://github.com/${user}/${repo}/actions/workflows/${workflow || 'ci.yml'}/badge.svg?branch=${branch || 'main'})` },
      { label: 'Codecov Coverage', md: `![Coverage](https://codecov.io/gh/${user}/${repo}/branch/${branch || 'main'}/graph/badge.svg)` },
      { label: 'GitHub Stars', md: `![Stars](https://img.shields.io/github/stars/${user}/${repo}?style=${style}&logo=github)` },
      { label: 'GitHub Forks', md: `![Forks](https://img.shields.io/github/forks/${user}/${repo}?style=${style}&logo=github)` },
      { label: 'GitHub Issues', md: `![Issues](https://img.shields.io/github/issues/${user}/${repo}?style=${style})` },
      { label: 'License', md: `![License](https://img.shields.io/github/license/${user}/${repo}?style=${style})` }
    ];
  };

  const generateProfileBlock = () => {
    const user = plain(ctx.user);
    const { profileName, style } = ctx;
    const linkedin = plain(ctx.linkedin);
    const portfolio = plain(ctx.portfolio);
    const stackBadges = (ctx.stack || '').split(',').map(s => s.trim()).filter(Boolean).map(s => 
      `![${s}](https://img.shields.io/badge/${encodeURIComponent(s)}-black?style=${style}&logo=${encodeURIComponent(s)})`
    ).join(' ');

    return `### Hi there 👋, I'm ${profileName}

**GitHub Stats**
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&theme=dark)
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=dark)

**Tech Stack**
${stackBadges}

**Connect with me**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${style}&logo=linkedin&logoColor=white)](https://linkedin.com/in/${linkedin})
[![Portfolio](https://img.shields.io/badge/Portfolio-2563EB?style=${style}&logo=globe&logoColor=white)](https://${portfolio})`;
  };

  const projectBadges = generateProjectBadges();
  const profileBlock = generateProfileBlock();

  return (
    <Box sx={{ p: 1 }}>
      <ToggleButtonGroup
        fullWidth
        value={mode}
        exclusive
        onChange={(_, m) => m && setMode(m)}
        size="small"
        sx={{ mb: 4 }}
      >
        <ToggleButton value="project" sx={{ fontWeight: 800, fontSize: '0.625rem' }}>PROJECT REPO</ToggleButton>
        <ToggleButton value="profile" sx={{ fontWeight: 800, fontSize: '0.625rem' }}>DEVELOPER PROFILE</ToggleButton>
      </ToggleButtonGroup>

      {mode === 'project' ? (
        <Box>
          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6 }}><InputField label="Owner / Org" value={ctx.user} onChange={v => update('user', v)} /></Grid>
            <Grid size={{ xs: 6 }}><InputField label="Repository" value={ctx.repo} onChange={v => update('repo', v)} /></Grid>
            <Grid size={{ xs: 4 }}><InputField label="Branch" value={ctx.branch} onChange={v => update('branch', v)} /></Grid>
            <Grid size={{ xs: 8 }}><InputField label="Workflow File" value={ctx.workflow} onChange={v => update('workflow', v)} /></Grid>
            <Grid size={{ xs: 12 }}><InputField label="Shields Style (e.g. flat, for-the-badge)" value={ctx.style} onChange={v => update('style', v)} /></Grid>
          </Grid>
          
          {(!ctx.user?.trim() || !ctx.repo?.trim()) && (
            <Alert severity="warning" sx={{ mb: 2, fontSize: '0.7rem' }}>
              Enter Owner and Repository to generate valid badge URLs.
            </Alert>
          )}

          <Stack spacing={2}>
            {projectBadges.length === 0 ? (
              <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center', display: 'block', py: 2 }}>
                Fill in Owner / Org and Repository above.
              </Typography>
            ) : projectBadges.map((b, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.neutral' }}>
                <Box sx={{ overflow: 'hidden', mr: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 0.5 }}>{b.label}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.65rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.md}</Typography>
                </Box>
                <IconButton size="small" onClick={() => onCopy(b.md, b.label)} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                  <ContentCopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Paper>
            ))}
            {projectBadges.length > 0 && (
              <Button variant="contained" onClick={() => onCopy(projectBadges.map(b => b.md).join('\n'), 'All Badges')} sx={{ mt: 2, fontWeight: 800 }}>
                Copy All Repo Badges
              </Button>
            )}
          </Stack>
        </Box>
      ) : (
        <Box>
          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6 }}><InputField label="GitHub Username" value={ctx.user} onChange={v => update('user', v)} /></Grid>
            <Grid size={{ xs: 6 }}><InputField label="Display Name" value={ctx.profileName} onChange={v => update('profileName', v)} /></Grid>
            <Grid size={{ xs: 12 }}><InputField label="Tech Stack (comma separated)" value={ctx.stack} onChange={v => update('stack', v)} /></Grid>
            <Grid size={{ xs: 6 }}><InputField label="LinkedIn Username" value={ctx.linkedin} onChange={v => update('linkedin', v)} /></Grid>
            <Grid size={{ xs: 6 }}><InputField label="Portfolio URL" value={ctx.portfolio} onChange={v => update('portfolio', v)} /></Grid>
          </Grid>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral', position: 'relative' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1 }}>PROFILE README.MD GENERATED</Typography>
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.7rem', whiteSpace: 'pre-wrap', color: 'text.primary', bgcolor: 'background.paper', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              {profileBlock}
            </Box>
            <Button fullWidth variant="contained" onClick={() => onCopy(profileBlock, 'Profile README')} startIcon={<ContentCopyIcon />} sx={{ mt: 2, fontWeight: 800 }}>
              Copy Profile Markdown
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default GitHubTab;
