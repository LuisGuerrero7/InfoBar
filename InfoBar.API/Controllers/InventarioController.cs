using Microsoft.AspNetCore.Mvc;
using InfoBar.API.Data;
using System.Linq;

namespace InfoBar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var inventario = _context.Productos
                .Select(p => new {
                    p.Id,
                    p.Nombre,
                    p.Stock
                }).ToList();

            return Ok(inventario);
        }
    }
}
