using Microsoft.AspNetCore.Mvc;
using InfoBar.API.Models;
using InfoBar.API.Data;
using Microsoft.EntityFrameworkCore;

namespace InfoBar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Detalles)
                .ToListAsync();

            var resultado = pedidos.Select(p => new
            {
                p.Id,
                p.Fecha,
                Detalles = p.Detalles.Select(d =>
                {
                    var producto = _context.Productos.FirstOrDefault(prod => prod.Id == d.ProductoId);
                    return new
                    {
                        d.ProductoId,
                        Producto = producto?.Nombre ?? "Desconocido",
                        d.Cantidad,
                        Subtotal = producto != null ? producto.Precio * d.Cantidad : 0
                    };
                }).ToList()
            });

            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Pedido pedido)
        {
            foreach (var detalle in pedido.Detalles)
            {
                var producto = await _context.Productos.FindAsync(detalle.ProductoId);
                if (producto == null)
                    return BadRequest($"El producto con ID {detalle.ProductoId} no existe.");

                if (producto.Stock < detalle.Cantidad)
                    return BadRequest($"No hay suficiente stock para {producto.Nombre}.");

                producto.Stock -= detalle.Cantidad;
            }

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = pedido.Id }, pedido);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Pedido pedidoActualizado)
        {
            var pedidoExistente = await _context.Pedidos
                .Include(p => p.Detalles)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedidoExistente == null)
                return NotFound("El pedido no existe.");

            foreach (var detalle in pedidoExistente.Detalles)
            {
                var producto = await _context.Productos.FindAsync(detalle.ProductoId);
                if (producto != null)
                    producto.Stock += detalle.Cantidad;
            }

            // Limpiar los detalles antiguos del pedido
            _context.PedidoDetalles.RemoveRange(pedidoExistente.Detalles);

            // Validar nuevo stock y aplicar los detalles actualizados
            foreach (var nuevoDetalle in pedidoActualizado.Detalles)
            {
                var producto = await _context.Productos.FindAsync(nuevoDetalle.ProductoId);
                if (producto == null)
                    return BadRequest($"El producto con ID {nuevoDetalle.ProductoId} no existe.");

                if (producto.Stock < nuevoDetalle.Cantidad)
                    return BadRequest($"No hay suficiente stock para {producto.Nombre}.");

                producto.Stock -= nuevoDetalle.Cantidad;

                // Agregamos el nuevo detalle al pedido existente
                pedidoExistente.Detalles.Add(new PedidoDetalle
                {
                    ProductoId = nuevoDetalle.ProductoId,
                    Cantidad = nuevoDetalle.Cantidad
                });
            }

            // Actualizar fecha (opcional)
            pedidoExistente.Fecha = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok("Pedido actualizado correctamente.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Detalles)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
                return NotFound("El pedido no existe.");

            // Revertir el stock
            foreach (var detalle in pedido.Detalles)
            {
                var producto = await _context.Productos.FindAsync(detalle.ProductoId);
                if (producto != null)
                {
                    producto.Stock += detalle.Cantidad;
                }
            }

            // Eliminar detalles y el pedido
            _context.PedidoDetalles.RemoveRange(pedido.Detalles);
            _context.Pedidos.Remove(pedido);

            await _context.SaveChangesAsync();

            return Ok("Pedido eliminado y stock restablecido.");
        }
    }
}
