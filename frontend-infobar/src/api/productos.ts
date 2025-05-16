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
