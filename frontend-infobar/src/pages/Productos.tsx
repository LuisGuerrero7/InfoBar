import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Typography,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Snackbar, Alert, Box, Container
} from '@mui/material';

import type { Producto } from '../api/productos';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../api/productos';

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [abrir, setAbrir] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', stock: '' });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState<'success' | 'error'>('success');

  useEffect(() => {
    async function fetchProductos() {
      const data = await getProductos();
      setProductos(data);
    }
    fetchProductos();
  }, []);

  const validarCampos = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      setError('Todos los campos son obligatorios.');
      setTipoAlerta('error');
      setMostrarAlerta(true);
      return false;
    }

    const precio = parseFloat(nuevoProducto.precio);
    const stock = parseInt(nuevoProducto.stock);

    if (isNaN(precio) || precio <= 0) {
      setError('El precio debe ser un número mayor que 0.');
      setTipoAlerta('error');
      setMostrarAlerta(true);
      return false;
    }

    if (isNaN(stock) || stock < 0) {
      setError('El stock debe ser un número mayor o igual a 0.');
      setTipoAlerta('error');
      setMostrarAlerta(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    try {
      const productoPayload = {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock)
      };

      if (modoEdicion && productoEditandoId !== null) {
        await actualizarProducto(productoEditandoId, productoPayload);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await crearProducto(productoPayload);
        setMensaje('Producto creado correctamente.');
      }

      setTipoAlerta('success');
      setMostrarAlerta(true);
      setAbrir(false);
      setModoEdicion(false);
      setProductoEditandoId(null);
      setNuevoProducto({ nombre: '', precio: '', stock: '' });

      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError('Hubo un error al guardar el producto.');
      setTipoAlerta('error');
      setMostrarAlerta(true);
    }
  };

  const abrirEdicion = (producto: Producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      stock: producto.stock.toString()
    });
    setProductoEditandoId(producto.id);
    setModoEdicion(true);
    setAbrir(true);
  };

  const confirmarEliminar = async () => {
    if (productoAEliminar === null) return;
    try {
      await eliminarProducto(productoAEliminar);
      const data = await getProductos();
      setProductos(data);
      setMensaje('Producto eliminado correctamente.');
      setTipoAlerta('success');
      setMostrarAlerta(true);
    } catch (error) {
      setError('Error al eliminar producto.');
      setTipoAlerta('error');
      setMostrarAlerta(true);
    } finally {
      setProductoAEliminar(null);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" fontWeight="bold" mt={4} color="#0A2F5C">
        Lista de Productos
      </Typography>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          onClick={() => {
            setAbrir(true);
            setModoEdicion(false);
            setNuevoProducto({ nombre: '', precio: '', stock: '' });
          }}
          sx={{
            backgroundColor: '#00a76f',
            '&:hover': { backgroundColor: '#007b56' },
            boxShadow: 2
          }}
        >
          Agregar Producto
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 3, mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.id}
                hover
                sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#f9fbfd' } }}
              >
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>S/ {producto.precio.toFixed(2)}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => abrirEdicion(producto)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setProductoAEliminar(producto.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal crear/editar producto */}
      <Dialog open={abrir} onClose={() => setAbrir(false)}>
        <DialogTitle>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            />
            <TextField
              label="Precio"
              type="number"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            />
            <TextField
              label="Stock"
              type="number"
              value={nuevoProducto.stock}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbrir(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {modoEdicion ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={productoAEliminar !== null} onClose={() => setProductoAEliminar(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este producto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductoAEliminar(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmarEliminar}>
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
          {tipoAlerta === 'success' ? mensaje : error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
