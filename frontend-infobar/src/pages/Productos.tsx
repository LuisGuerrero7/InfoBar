import { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Typography,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';

import type { Producto } from '../api/productos';
import { getProductos, crearProducto } from '../api/productos';

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [abrir, setAbrir] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });

  useEffect(() => {
    async function fetchProductos() {
      const data = await getProductos();
      setProductos(data);
    }
    fetchProductos();
  }, []);

  const handleSubmit = async () => {
    try {
      await crearProducto({
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock)
      });
      setAbrir(false);
      setNuevoProducto({ nombre: '', precio: '', stock: '' });
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al crear producto', error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setAbrir(true)}
      >
        Agregar Producto
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ p: 2 }}>
          Lista de Productos
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>S/ {producto.precio.toFixed(2)}</TableCell>
                <TableCell>{producto.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={abrir} onClose={() => setAbrir(false)}>
        <DialogTitle>Nuevo Producto</DialogTitle>
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
          <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
