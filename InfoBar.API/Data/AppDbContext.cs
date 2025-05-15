using Microsoft.EntityFrameworkCore;
using InfoBar.API.Models;

namespace InfoBar.API.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Producto> Productos { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}