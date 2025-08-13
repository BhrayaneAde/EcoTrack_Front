import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Bleu moderne
      contrastText: '#fff',
    },
    secondary: {
      main: '#43a047', // Vert doux
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8', // Fond général
      paper: '#fff',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#43a047',
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
        },
        containedPrimary: {
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 16px rgba(60,72,100,0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 2px 16px rgba(60,72,100,0.09)',
        },
      },
    },
  },
});

export default theme;
