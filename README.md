# 🧪 InfoBar - Sistema de Gestión para Bares

**InfoBar** Permite gestionar productos, realizar pedidos y visualizar métricas de venta en un dashboard moderno.

---

## 🚀 Tecnologías utilizadas

**Frontend** (React + Vite + TypeScript + Material UI):
- React 18 con TypeScript
- Material UI (MUI v5) para estilos visuales profesionales
- Axios para consumo de APIs
- Vite para bundling rápido y moderno
- ChartJS / Recharts para el dashboard visual

**Backend** (C# .NET + SQLite):
- ASP.NET Core Web API
- Entity Framework Core
- SQLite como base de datos ligera en desarrollo
- Arquitectura RESTful con endpoints bien estructurados

---

## 🧩 Funcionalidades principales

- ✅ CRUD de productos
- ✅ CRUD de pedidos con impacto en el inventario
- ✅ Validaciones visuales y mensajes de éxito/error
- ✅ Dashboard con métricas de ventas en tiempo real
- ✅ Interfaz moderna, accesible y responsive

---

## 📦 Instalación y uso local

```bash
# Clona el repositorio
git clone https://github.com/LuisGuerrero7/InfoBar

#Si esta desde Visual Studio Code
- Instalar .NET y EF Core CLI (BD)
dotnet --version
dotnet tool install --global dotnet-ef
dotnet ef

#Para lanzar el Backend

dotnet restore          # Instala dependencias
dotnet ef database update   # Crea la base de datos SQLite
dotnet run             # Lanza el servidor backend

---> El backend se ejecutará en: http://localhost:5083

# Entra al frontend
cd InfoBar.Front
npm install
npm run dev

---> El frontend estará en: http://localhost:5173
