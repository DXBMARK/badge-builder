/*
 * Project: Badge Builder Pro
 * Author: [TS]
 * Purpose: Brand Kit Management Tab
 * Notes: Placeholder for future brand features.
 */

import { useNameDialog } from '../ui/NameDialog';
import { Box, Typography, Button, Stack, Paper, Grid, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { BUILT_IN_BRANDS } from '../../constants/brands';

import { getContrastColor } from '../../utils/sanitize';

const BrandCard = ({ brand, onApply, onDelete, isCustom }) => {
  const applyBrand = () => {
    onApply({
      leftBg: brand.colors.primary,
      rightBg: brand.colors.secondary,
      leftTextColor: getContrastColor(brand.colors.primary),
      rightTextColor: getContrastColor(brand.colors.secondary),
      gradStart: brand.colors.gradientStart,
      gradEnd: brand.colors.gradientEnd,
      fontFamily: brand.typography.fontFamily,
      borderRadius: brand.geometry.radius,
      outlineWidth: brand.geometry.borderWidth,
      outlineColor: brand.colors.border,
      useGradient: brand.useGradient || false
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>{brand.name}</Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.55rem' }}>{brand.typography.fontFamily}</Typography>
        </Box>
        {isCustom && (
          <IconButton size="small" color="error" onClick={() => onDelete(brand.id)} sx={{ p: 0.5 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Stack>

      {/* Color Palette Display */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        {[brand.colors.primary, brand.colors.secondary, brand.colors.textLight, brand.colors.gradientEnd].map((color, i) => (
          <Box key={i} sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: color, border: '1px solid', borderColor: 'divider' }} />
        ))}
      </Stack>

      <Button fullWidth variant="contained" size="small" startIcon={<ColorLensIcon />} onClick={applyBrand} sx={{ py: 0.35, borderRadius: 1.5, fontWeight: 700, fontSize: '0.6rem', lineHeight: 1.4 }}>
        Apply Brand
      </Button>
    </Paper>
  );
};

const BrandTab = ({ config, update, customBrands = {}, saveBrand, deleteBrand }) => {
  const [nameDialog, askName] = useNameDialog();
  
  const handleSaveBrand = async () => {
    const name = await askName('Save brand kit', 'Brand kit name');
    if (!name) return;
    
    const newBrand = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      colors: {
        primary: config.leftBg,
        secondary: config.rightBg,
        textLight: config.rightTextColor,
        textDark: config.leftTextColor,
        gradientStart: config.gradStart,
        gradientEnd: config.gradEnd,
        border: config.outlineColor
      },
      typography: { fontFamily: config.fontFamily },
      geometry: { radius: config.borderRadius, borderWidth: config.outlineWidth },
      useGradient: config.useGradient
    };
    saveBrand(newBrand);
  };

  const handleApply = (brandUpdates) => {
    Object.entries(brandUpdates).forEach(([k, v]) => update(k, v));
  };

  const customList = Object.values(customBrands);

  return (
    <Box sx={{ p: 1 }}>
      {nameDialog}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<SaveIcon />}
        onClick={handleSaveBrand}
        sx={{ mb: 2.5, py: 1, borderRadius: 2.5, fontWeight: 800, boxShadow: '0 4px 12px rgba(249,126,26,0.25)' }}
      >
        Save Current as Brand Kit
      </Button>

      {customList.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.6rem' }}>
            My Brand Kits
          </Typography>
          <Grid container spacing={1.5}>
            {customList.map(brand => (
          <Grid size={{ xs: 6 }} key={brand.id}>
                <BrandCard brand={brand} onApply={handleApply} onDelete={deleteBrand} isCustom />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.6rem' }}>
        Built-in Brand Kits
      </Typography>
      <Grid container spacing={1.5}>
        {BUILT_IN_BRANDS.map(brand => (
          <Grid size={{ xs: 6 }} key={brand.id}>
            <BrandCard brand={brand} onApply={handleApply} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BrandTab;
