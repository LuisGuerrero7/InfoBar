using System;
using System.Collections.Generic;

namespace InfoBar.API.Models
{
    public class Pedido
    {
        public int Id {get; set;}
        public DateTime Fecha {get; set;} = DateTime.Now;
        public List<PedidoDetalle> Detalles {get; set;} = new List<PedidoDetalle>();
    }
}