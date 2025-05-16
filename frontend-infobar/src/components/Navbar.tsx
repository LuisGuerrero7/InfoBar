import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#043673' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          onClick={() => navigate('/')}
          sx={{
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'white',
            '&:hover': { color: '#1976d2' }
          }}
        >
          INFObar
        </Typography>

        <Box>
          <Button color="inherit" onClick={() => navigate('/productos')}>
            Productos
          </Button>
          <Button color="inherit" onClick={() => navigate('/pedidos')}>
            Pedidos
          </Button>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
