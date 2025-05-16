import { useEffect, useState } from 'react';
import {
  Autocomplete, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Snackbar, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
  Paper, Alert, Box, Container
} from '@mui/material';

import type { Producto } from '../api/productos';
import { getProductos } from '../api/productos';
import { crearPedido, getPedidos, eliminarPedido } from '../api/pedidos';

interface PedidoDetalleInput {
  producto: Producto | null;
  cantidad: number;
}

interface Pedido {
  id: number;
  fecha: string;
  detalles: {
    productoId: number;
    producto: string;
    cantidad: number;
    subtotal: number;
  }[];
}

export default function Pedidos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [detalles, setDetalles] = useState<PedidoDetalleInput[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [abrirDialog, setAbrirDialog] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<number | null>(null);

  const [mensaje, setMensaje] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState<'success' | 'error'>('success');

  useEffect(() => {
    async function fetchData() {
      const prods = await getProductos();
      const peds = await getPedidos();
      setProductos(prods);
      setPedidos(peds);
    }
    fetchData();
  }, []);

  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      setMensaje('Selecciona un producto y una cantidad válida');
      setTipoAlerta('error');
      setMostrarAlerta(true);
      return;
    }
    setDetalles([...detalles, { producto: productoSeleccionado, cantidad }]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const eliminarDetalle = (index: number) => {
    const copia = [...detalles];
    copia.splice(index, 1);
    setDetalles(copia);
  };

  const handleGuardarPedido = async () => {
    if (detalles.length === 0) return;

    const detallesPayload = detalles.map((d) => ({
      productoId: d.producto!.id,
      cantidad: d.cantidad
    }));

    try {
      await crearPedido({ detalles: detallesPayload });
      const nuevosPedidos = await getPedidos();
      setPedidos(nuevosPedidos);
      setDetalles([]);
      setAbrirDialog(false);
      setMensaje('Pedido creado correctamente');
      setTipoAlerta('success');
      setMostrarAlerta(true);
    } catch (error) {
      setMensaje('Error al crear pedido');
      setTipoAlerta('error');
      setMostrarAlerta(true);
    }
  };

  const confirmarEliminarPedido = async () => {
    if (pedidoAEliminar !== null) {
      try {
        await eliminarPedido(pedidoAEliminar);
        const nuevos = await getPedidos();
        setPedidos(nuevos);
        setMensaje('Pedido eliminado');
        setTipoAlerta('success');
        setMostrarAlerta(true);
      } catch (err) {
        setMensaje('Error al eliminar pedido');
        setTipoAlerta('error');
        setMostrarAlerta(true);
      } finally {
        setPedidoAEliminar(null);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" fontWeight="bold" mt={4} color="#0A2F5C">
        Pedidos Realizados
      </Typography>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          onClick={() => {
            setAbrirDialog(true);
            setDetalles([]);
          }}
          sx={{
            backgroundColor: '#007B56',
            '&:hover': { backgroundColor: '#005e41' },
            boxShadow: 2
          }}
        >
          Crear nuevo pedido
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 3, mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Detalles</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow
                key={pedido.id}
                hover
                sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#f9fbfd' } }}
              >
                <TableCell>{new Date(pedido.fecha).toLocaleString()}</TableCell>
                <TableCell>
                  {pedido.detalles.map((d, i) => (
                    <div key={i}>
                      {d.producto} x {d.cantidad} = S/ {d.subtotal.toFixed(2)}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  S/ {pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setPedidoAEliminar(pedido.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={abrirDialog} onClose={() => setAbrirDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Pedido</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={productos}
              getOptionLabel={(p) => `${p.nombre} - S/ ${p.precio.toFixed(2)} (Stock: ${p.stock})`}
              value={productoSeleccionado}
              onChange={(e, val) => setProductoSeleccionado(val)}
              renderInput={(params) => <TextField {...params} label="Producto" />}
            />
            <TextField
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
            />
            <Button variant="outlined" onClick={agregarDetalle} sx={{ alignSelf: 'flex-start' }}>
              Agregar al pedido
            </Button>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell><strong>Cantidad</strong></TableCell>
                  <TableCell><strong>Precio</strong></TableCell>
                  <TableCell><strong>Subtotal</strong></TableCell>
                  <TableCell><strong>Eliminar</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detalles.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.producto?.nombre}</TableCell>
                    <TableCell>{d.cantidad}</TableCell>
                    <TableCell>S/ {d.producto?.precio.toFixed(2)}</TableCell>
                    <TableCell>S/ {(d.producto!.precio * d.cantidad).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button color="error" size="small" onClick={() => eliminarDetalle(i)}>
                        X
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbrirDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGuardarPedido}>
            Guardar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pedidoAEliminar !== null} onClose={() => setPedidoAEliminar(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este pedido?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPedidoAEliminar(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmarEliminarPedido}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={mostrarAlerta}
        autoHideDuration={4000}
        onClose={() => setMostrarAlerta(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setMostrarAlerta(false)} severity={tipoAlerta} sx={{ width: '100%' }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </Container>
  );
}
