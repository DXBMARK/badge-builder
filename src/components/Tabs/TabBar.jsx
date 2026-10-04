/*
 * Project: SVG Badge Builder
 * Author: [TS]
 * Purpose: MUI Tab Bar Component
 * Notes: Follow TS conventions.
 */

import { Tabs, Tab, Box } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import PaletteIcon from '@mui/icons-material/Palette';
import SaveIcon from '@mui/icons-material/Save';
import InterestsIcon from '@mui/icons-material/Interests';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CollectionsIcon from '@mui/icons-material/Collections';

const TABS = [
  { id: 'content', icon: <TextFieldsIcon />, label: 'Text' },
  { id: 'layout', icon: <AspectRatioIcon />, label: 'Layout' },
  { id: 'style', icon: <PaletteIcon />, label: 'Style' },
  { id: 'icon', icon: <InterestsIcon />, label: 'Icons' },
  { id: 'presets', icon: <SaveIcon />, label: 'Presets' },
  { id: 'brand', icon: <BrandingWatermarkIcon />, label: 'Brand' },
  { id: 'pack', icon: <CollectionsIcon />, label: 'Packs' },
  { id: 'github', icon: <MenuBookIcon />, label: 'README' },
  { id: 'bulk', icon: <AutoFixHighIcon />, label: 'Bulk' }
];

/**
 * [TS] MUI-based tab navigation.
 * @param {Object} props
 * @returns {JSX.Element}
 */
const TabBar = ({ activeTab, onTabChange }) => {
  const currentIdx = TABS.findIndex(t => t.id === activeTab);
  
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={currentIdx >= 0 ? currentIdx : 0} 
        onChange={(_, newValue) => onTabChange(TABS[newValue].id)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minWidth: { xs: 64, sm: 80 },
            fontSize: { xs: '0.58rem', sm: '0.625rem' },
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            py: { xs: 1.25, sm: 2 },
            px: { xs: 1, sm: 1.5 },
          }
        }}
      >
        {TABS.map(t => (
          <Tab 
            key={t.id} 
            icon={t.icon} 
            label={t.label} 
            iconPosition="top"
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabBar;
