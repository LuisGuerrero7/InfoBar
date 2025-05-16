import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          InfoBar
        </Typography>
        <Button color="inherit" component={Link} to="/productos">Productos</Button>
        <Button color="inherit" component={Link} to="/pedidos">Pedidos</Button>
        <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
      </Toolbar>
    </AppBar>
  );
}

