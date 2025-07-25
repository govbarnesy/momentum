import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Collapse,
  Stack,
  Divider,
  Paper,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Fab,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useThemeEditor } from '../../../App';
import { ThemeConfig } from '../../../types/theme.types';
import { ColorPicker } from './ColorPicker';
import { LivePreview } from './LivePreview';

type ExpandedSection = 'palette' | 'typography' | 'shape' | 'shadows' | '';

export const ThemeEditor: React.FC = () => {
  const { themeConfig, updateTheme, resetTheme } = useThemeEditor();
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>('palette');

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'light' | 'dark' | null) => {
    if (newMode !== null) {
      updateTheme({ mode: newMode });
    }
  };

  const handleColorChange = (colorType: keyof ThemeConfig['palette'], value: string) => {
    if (typeof themeConfig.palette[colorType] === 'string') {
      updateTheme({
        palette: {
          ...themeConfig.palette,
          [colorType]: value,
        },
      });
    }
  };

  const getColorDescription = (color: string): string => {
    const descriptions: Record<string, string> = {
      primary: 'Main brand color for primary actions',
      secondary: 'Accent color for secondary actions',
      error: 'Color for error states and messages',
      warning: 'Color for warning alerts',
      info: 'Color for informational messages',
      success: 'Color for success states',
    };
    return descriptions[color] || `Theme ${color} color`;
  };

  const handleTypographyChange = (field: keyof ThemeConfig['typography'], value: string | number) => {
    updateTheme({
      typography: {
        ...themeConfig.typography,
        [field]: value,
      },
    });
  };

  const handleShapeChange = (field: keyof ThemeConfig['shape'], value: number) => {
    updateTheme({
      shape: {
        ...themeConfig.shape,
        [field]: value,
      },
    });
  };

  const handleShadowsChange = (field: keyof ThemeConfig['shadows'], value: boolean | number) => {
    updateTheme({
      shadows: {
        ...themeConfig.shadows,
        [field]: value,
      },
    });
  };

  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Panel - Editor */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={2}>
            {/* Mode Toggle */}
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Theme Mode</Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ToggleButtonGroup
                      value={themeConfig.mode}
                      exclusive
                      onChange={handleModeChange}
                      aria-label="theme mode"
                      size="small"
                    >
                      <ToggleButton value="light" aria-label="light mode">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <span>☀️</span>
                          <span>Light</span>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value="dark" aria-label="dark mode">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <span>🌙</span>
                          <span>Dark</span>
                        </Box>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={resetTheme}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Color Palette</Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('palette')}
                  >
                    {expandedSection === 'palette' ? <CloseIcon /> : <AddIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSection === 'palette'}>
                  <Grid container spacing={3}>
                    {(['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const).map((color) => (
                      <Grid size={{ xs: 12, md: 6 }} key={color}>
                        <ColorPicker
                          label={color.charAt(0).toUpperCase() + color.slice(1)}
                          value={themeConfig.palette[color] as string}
                          onChange={(value) => handleColorChange(color, value)}
                          helperText={getColorDescription(color)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box mt={3} p={2} bgcolor="background.paper" borderRadius={2}>
                    <Typography variant="subtitle2" gutterBottom>Preview</Typography>
                    <Grid container spacing={2}>
                      {(['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const).map((color) => (
                        <Grid key={color}>
                          <Box textAlign="center">
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                backgroundColor: `${color}.main`,
                                borderRadius: 2,
                                mb: 1,
                                boxShadow: 1,
                              }}
                            />
                            <Typography variant="caption">{color}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Typography</Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('typography')}
                  >
                    {expandedSection === 'typography' ? <CloseIcon /> : <AddIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSection === 'typography'}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                        Font Family
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        value={themeConfig.typography.fontFamily}
                        onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                      >
                        <MenuItem value='"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif'>DM Sans (Default)</MenuItem>
                        <MenuItem value='"Roboto", "Helvetica", "Arial", sans-serif'>Roboto</MenuItem>
                        <MenuItem value='"Inter", "Helvetica", "Arial", sans-serif'>Inter</MenuItem>
                        <MenuItem value='"Poppins", "Helvetica", "Arial", sans-serif'>Poppins</MenuItem>
                        <MenuItem value='"Open Sans", "Helvetica", "Arial", sans-serif'>Open Sans</MenuItem>
                      </Select>
                    </Box>

                    <Box>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                        Font Sizes
                      </Typography>
                      <Grid container spacing={3}>
                        {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2'] as const).map((variant) => (
                          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={variant}>
                            <Box sx={{ 
                              p: 2, 
                              border: 1, 
                              borderColor: 'divider', 
                              borderRadius: 1,
                              backgroundColor: 'background.paper'
                            }}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                  {variant.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                  {(themeConfig.typography[`${variant}Size` as keyof ThemeConfig['typography']] as number).toFixed(1)}rem
                                </Typography>
                              </Box>
                              <Slider
                                value={themeConfig.typography[`${variant}Size` as keyof ThemeConfig['typography']] as number}
                                onChange={(_, value) => handleTypographyChange(`${variant}Size` as keyof ThemeConfig['typography'], value as number)}
                                min={0.5}
                                max={4}
                                step={0.1}
                                valueLabelDisplay="auto"
                                size="small"
                                sx={{
                                  '& .MuiSlider-thumb': {
                                    width: 16,
                                    height: 16,
                                  },
                                  '& .MuiSlider-valueLabel': {
                                    fontSize: 12,
                                    background: 'rgba(0, 0, 0, 0.8)',
                                  }
                                }}
                              />
                              <Typography 
                                variant={variant as any} 
                                sx={{ 
                                  mt: 1, 
                                  fontSize: `${themeConfig.typography[`${variant}Size` as keyof ThemeConfig['typography']]}rem`,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {variant === 'h1' ? 'Heading 1' :
                                 variant === 'h2' ? 'Heading 2' :
                                 variant === 'h3' ? 'Heading 3' :
                                 variant === 'h4' ? 'Heading 4' :
                                 variant === 'h5' ? 'Heading 5' :
                                 variant === 'h6' ? 'Heading 6' :
                                 variant === 'body1' ? 'Body Text' :
                                 'Small Text'}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Stack>
                </Collapse>
              </CardContent>
            </Card>

            {/* Shape & Spacing */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Shape & Spacing</Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('shape')}
                  >
                    {expandedSection === 'shape' ? <CloseIcon /> : <AddIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSection === 'shape'}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                        Border Radius: {themeConfig.shape.borderRadius}px
                      </Typography>
                      <Slider
                        value={themeConfig.shape.borderRadius}
                        onChange={(_, value) => handleShapeChange('borderRadius', value as number)}
                        min={0}
                        max={24}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                        Spacing Unit: {themeConfig.spacing}px
                      </Typography>
                      <Slider
                        value={themeConfig.spacing}
                        onChange={(_, value) => updateTheme({ spacing: value as number })}
                        min={2}
                        max={16}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Stack>
                </Collapse>
              </CardContent>
            </Card>

            {/* Shadows */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Shadows</Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleSection('shadows')}
                  >
                    {expandedSection === 'shadows' ? <CloseIcon /> : <AddIcon />}
                  </IconButton>
                </Box>
                <Collapse in={expandedSection === 'shadows'}>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={themeConfig.shadows.enabled}
                          onChange={(e) => handleShadowsChange('enabled', e.target.checked)}
                        />
                      }
                      label="Enable Shadows"
                    />
                    {themeConfig.shadows.enabled && (
                      <Box>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                          Shadow Intensity: {themeConfig.shadows.intensity}
                        </Typography>
                        <Slider
                          value={themeConfig.shadows.intensity}
                          onChange={(_, value) => handleShadowsChange('intensity', value as number)}
                          min={0.1}
                          max={2}
                          step={0.1}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    )}
                  </Stack>
                </Collapse>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Panel - Live Preview */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <LivePreview />
        </Grid>
      </Grid>
    </Box>
  );
};