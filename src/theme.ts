import { RefineThemes } from '@refinedev/mui';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import gray from '@mui/material/colors/grey';

const DarkTheme = createTheme({
  ...RefineThemes.PurpleDark,
  palette: {
    ...RefineThemes.PurpleDark.palette,
    primary: {
      main: '#5041BC',
      light: '#6A5DD1',
      dark: '#372B84',
    },
    secondary: {
      main: '#7986CB', // más brillante para dark mode
      light: '#AAB6FE',
      dark: '#49599A',
    },
  },
  components: {
    ...RefineThemes.PurpleDark.components,
    MuiChip: {
      styleOverrides: {
        labelSmall: {
          lineHeight: '18px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'main.MuiBox-root': {
          backgroundColor: '#121212',
        },
        body: {
          backgroundColor: '#121212',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: 'body2',
      },
    },
  },
  typography: {
    fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
});

const LightTheme = createTheme({
  ...RefineThemes.Purple,
  palette: {
    ...RefineThemes.Purple.palette,
    primary: {
      main: '#5041BC',
      light: '#5041BC',
      dark: '#372B84',
    },
    secondary: {
      main: '#5C6BC0',
      light: '#8E99F3',
      dark: '#26418F',
    },
  },
  components: {
    ...RefineThemes.Purple.components,
    MuiChip: {
      styleOverrides: {
        labelSmall: {
          lineHeight: '18px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'main.MuiBox-root': {
          backgroundColor: gray[100],
        },
        body: {
          backgroundColor: gray[100],
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: 'body2',
      },
    },
  },
  typography: {
    fontFamily: ['Nunito', 'sans-serif'].join(','),
  },
});

const DarkThemeWithResponsiveFontSizes = responsiveFontSizes(DarkTheme);
const LightThemeWithResponsiveFontSizes = responsiveFontSizes(LightTheme);

export { LightThemeWithResponsiveFontSizes, DarkThemeWithResponsiveFontSizes };
