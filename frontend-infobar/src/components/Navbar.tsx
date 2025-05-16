import { AppBar, Box, Toolbar, Typography, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          underline="none"
          color="inherit"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          INFObar
        </Typography>

        <Button color="inherit" onClick={() => navigate('/productos')}>
          Productos
        </Button>
        <Button color="inherit" onClick={() => navigate('/pedidos')}>
          Pedidos
        </Button>
        <Button color="inherit" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
}
