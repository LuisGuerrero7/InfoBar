import api from './axios';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export async function getProductos(): Promise<Producto[]> {
  const response = await api.get<Producto[]>('/productos');
  return response.data;
}

export async function crearProducto(producto: Omit<Producto, 'id'>) {
  const response = await api.post('/productos', producto);
  return response.data;
}

export async function actualizarProducto(id: number, producto: Omit<Producto, 'id'>) {
  const response = await api.put(`/productos/${id}`, producto);
  return response.data;
}

export async function eliminarProducto(id: number) {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
}
