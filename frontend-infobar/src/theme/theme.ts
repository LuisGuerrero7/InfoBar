
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#29A850',
    },
    info: {
      main: '#00C4F4', 
    },
    background: {
      default: '#f5f7fa', 
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: ['"Segoe UI"', 'Roboto', 'Arial'].join(','),
    h5: {
      fontWeight: 600,
    },
  },
});

export default theme;
