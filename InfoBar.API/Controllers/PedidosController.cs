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
                .ThenInclude(d => d.Producto)
                .ToListAsync();

            return Ok(pedidos);
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
                detalle.Producto = producto;
            }

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = pedido.Id }, pedido);
        }
    }
}
