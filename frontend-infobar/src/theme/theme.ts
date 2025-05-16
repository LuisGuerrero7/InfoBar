import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00338D' // Azul oscuro de Infomática
    },
    secondary: {
      main: '#00C2FF' // Celeste
    },
    success: {
      main: '#1ED760' // Verde
    },
    background: {
      default: '#FFFFFF'
    },
    text: {
      primary: '#000000'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});

export default theme;