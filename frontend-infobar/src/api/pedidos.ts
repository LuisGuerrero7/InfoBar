import api from './axios';

interface PedidoDetalleInput {
  productoId: number;
  cantidad: number;
}

interface PedidoInput {
  detalles: PedidoDetalleInput[];
}

export async function crearPedido(pedido: PedidoInput) {
  const response = await api.post('/pedidos', pedido);
  return response.data;
}

export async function getPedidos() {
  const response = await api.get('/pedidos');
  return response.data;
}

export async function eliminarPedido(id: number) {
  const response = await api.delete(`/pedidos/${id}`);
  return response.data;
}
