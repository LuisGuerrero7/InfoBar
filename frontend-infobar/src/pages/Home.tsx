import { Typography, Button, Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="#003366">
          Bienvenido a INFObar
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Gestiona pedidos, controla tu inventario y obtén métricas claras en segundos.
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Box sx={{ mt: 3, mb: 5 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/productos')}
            sx={{ mr: 2, backgroundColor: '#1976d2', ':hover': { backgroundColor: '#145ea8' } }}
          >
            Ir a Productos
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate('/pedidos')}
            sx={{ backgroundColor: '#43a047', ':hover': { backgroundColor: '#388e3c' } }}
          >
            Ir a Pedidos
          </Button>
        </Box>
      </motion.div>

      <Grid container spacing={3}>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ backgroundColor: '#ffffff', borderLeft: '5px solid #1976d2' }}>
              <CardContent>
                <Inventory2Icon fontSize="large" color="primary" />
                <Typography variant="h6" mt={1}>Productos</Typography>
                <Typography color="text.secondary">Gestiona stock, precios y más.</Typography>
              </CardContent>
            </Card>
          </motion.div>


          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ backgroundColor: '#ffffff', borderLeft: '5px solid #43a047' }}>
              <CardContent>
                <ReceiptLongIcon fontSize="large" color="success" />
                <Typography variant="h6" mt={1}>Pedidos</Typography>
                <Typography color="text.secondary">Visualiza, entrega y controla ventas.</Typography>
              </CardContent>
            </Card>
          </motion.div>


          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ backgroundColor: '#ffffff', borderLeft: '5px solid #00bcd4' }}>
              <CardContent>
                <DashboardIcon fontSize="large" sx={{ color: '#00bcd4' }} />
                <Typography variant="h6" mt={1}>Dashboard</Typography>
                <Typography color="text.secondary">Métricas visuales y rendimiento.</Typography>
              </CardContent>
            </Card>
          </motion.div>
      </Grid>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <Typography variant="body1" sx={{ mt: 6 }} color="text.secondary">
          Optimiza la barra. Automatiza tu negocio.
        </Typography>
      </motion.div>
    </Box>
  );
}
