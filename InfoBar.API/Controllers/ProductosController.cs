using Microsoft.AspNetCore.Mvc;
using InfoBar.API.Models;
using InfoBar.API.Data;
using Microsoft.EntityFrameworkCore;

namespace InfoBar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var productos = await _context.Productos.ToListAsync();
            return Ok(productos);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = producto.Id }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Producto updated)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.Nombre = updated.Nombre;
            producto.Stock = updated.Stock;
            producto.Precio = updated.Precio;

            await _context.SaveChangesAsync();
            return Ok(producto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
