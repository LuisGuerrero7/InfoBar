import { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { getPedidos } from '../api/pedidos';

interface Pedido {
  id: number;
  fecha: string;
  detalles: {
    producto: string;
    cantidad: number;
    subtotal: number;
  }[];
}

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalPedidos = pedidos.length;
  const totalIngresos = pedidos.reduce(
    (acc, pedido) =>
      acc + pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0),
    0
  );

  const productosVendidos: Record<string, number> = {};
  pedidos.forEach((pedido) => {
    pedido.detalles.forEach((detalle) => {
      if (!productosVendidos[detalle.producto]) {
        productosVendidos[detalle.producto] = 0;
      }
      productosVendidos[detalle.producto] += detalle.cantidad;
    });
  });

  const productos = Object.keys(productosVendidos);
  const cantidades = Object.values(productosVendidos);
  const totalProductosVendidos = cantidades.reduce((sum, v) => sum + v, 0);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        align="center"
        gutterBottom
        paddingBottom={7}
      >
        Dashboard de Ventas
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          <Grid container spacing={3} direction="column">
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="subtitle1">Total productos vendidos</Typography>
                <Typography variant="h5" color="success.main">{totalProductosVendidos}</Typography>
              </Paper>

              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="subtitle1">Pedidos realizados</Typography>
                <Typography variant="h5" color="success.main">{totalPedidos}</Typography>
              </Paper>


              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="subtitle1">Ingresos totales</Typography>
                <Typography variant="h5" color="success.main">S/ {totalIngresos.toFixed(2)}</Typography>
              </Paper>

          </Grid>



          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos más vendidos
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: productos }]}
              series={[{ data: cantidades }]}
              height={300}
              colors={['#29A850']}
            />
          </Paper>

      </Grid>
    </Box>
  );
}
