# Dashboard de Ventas Avanzado

![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chart.js)

Panel de administración de ventas construido con JavaScript puro. Sin frameworks, sin librerías de componentes — solo código limpio y modular.

![Vista Previa del Dashboard](https://via.placeholder.com/1200x600/4F46E5/ffffff?text=Sales+Dashboard)

## ¿Qué es este proyecto?

Es un panel de administración de una sola página (SPA) diseñado para visualizar datos de ventas. Carga productos, usuarios y transacciones desde archivos JSON, procesa todo en memoria y muestra gráficos interactivos, tablas con filtros y KPIs en tiempo real.

Creado como proyecto de portafolio para demostrar arquitectura en vanilla JS, comunicación basada en eventos y diseño modular de componentes.

## Características

- **Tarjetas KPI** — Ingresos totales, transacciones, ticket promedio, clientes únicos
- **Gráficos Interactivos** — Tendencia de ingresos (líneas), ventas por región (barras), distribución por categoría (doughnut)
- **Tabla de Datos** — Tabla paginada de ventas con búsqueda en tiempo real por nombre de cliente o producto
- **Filtros Avanzados** — Filtrar por región, categoría y rango de fechas
- **Formulario de Nueva Venta** — Modal para agregar transacciones con selección de cliente/producto
- **Navegación SPA** — Cuatro vistas: Dashboard, Clientes, Productos, Configuración
- **Modo Oscuro** — Alternar con persistencia en localStorage
- **Moneda Configurable** — Cambiar entre USD, COP y EUR
- **Nombre de App Personalizable** — Cambiar el texto del logo en la barra lateral desde Configuración

## Stack Tecnológico

| Tecnología | Propósito |
|------------|-----------|
| [Vite](https://vitejs.dev/) | Herramienta de construcción y servidor de desarrollo |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilos utilitarios |
| [Chart.js](https://www.chartjs.org/) | Visualizaciones de datos interactivas |
| [Google Fonts](https://fonts.google.com/) | Tipografías Inter + JetBrains Mono |

**Sin frameworks.** Todos los componentes son módulos de JavaScript puro que se comunican mediante eventos nativos del DOM.

## Estructura del Proyecto

```
dashbord-ventas-avanzado/
├── public/
│   └── data/                  # Archivos de datos JSON
│       ├── users.json
│       ├── products.json
│       └── sales.json
├── src/
│   ├── components/
│   │   ├── chart-manager.js   # Gestión de instancias Chart.js
│   │   ├── customers-table.js # Vista de lista de clientes
│   │   ├── data-table.js      # Tabla paginada de ventas
│   │   ├── filter-bar.js      # Filtros de región, categoría, fechas
│   │   ├── products-table.js  # Vista de lista de productos
│   │   ├── sale-form.js       # Formulario modal de nueva venta
│   │   ├── settings-panel.js  # Configuración de nombre y moneda
│   │   └── stats-cards.js     # Componentes de tarjetas KPI
│   ├── services/
│   │   └── store.js           # Gestión de estado global
│   ├── styles/
│   │   └── main.css           # Configuración Tailwind + estilos
│   ├── utils/
│   │   └── formatters.js      # Formateo de moneda y fechas
│   └── main.js                # Punto de entrada y enrutador
├── index.html
├── vite.config.js
└── package.json
```

## Cómo Empezar

### Requisitos Previos

- Node.js 18 o superior
- npm, pnpm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/dashbord-ventas-avanzado.git

# Navegar al proyecto
cd dashbord-ventas-avanzado

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app se abrirá automáticamente en `http://localhost:5173`.

### Construir para Producción

```bash
npm run build
npm run preview
```

## Uso

### Vista Dashboard
- Visualiza los KPIs en tiempo real en la parte superior
- Usa los filtros para reducir datos por región, categoría o rango de fechas
- Busca ventas por nombre de cliente o producto en la tabla
- Navega entre páginas usando la paginación
- Haz clic en "New Sale" para agregar una transacción

### Vista Clientes
- Visualiza todos los usuarios registrados con su región

### Vista Productos
- Visualiza todos los productos con precios en la moneda configurada

### Vista Configuración
- Cambia el nombre de la aplicación (actualiza la barra lateral en tiempo real)
- Cambia la moneda entre USD, COP y EUR

## Configuración

| Configuración | Ubicación | Persistencia |
|---------------|-----------|--------------|
| Modo Oscuro | Botón en la barra de navegación | localStorage |
| Nombre de App | Página de Configuración | localStorage |
| Moneda | Página de Configuración | localStorage |

## Arquitectura

La aplicación utiliza una arquitectura basada en eventos:

```
Acción del Usuario → Evento Personalizado → main.js (orquestador)
    ↓
store.js → Procesar Datos → Retornar resultados filtrados
    ↓
Componentes → Actualizar DOM → El usuario ve los cambios
```

Los componentes nunca se comunican directamente. Todo el flujo de datos pasa por el orquestador central en `main.js`.

## Autor

**Johan Steven Cuero Rodríguez** — [@Instagram](https://www.instagram.com/johan_stevencr/)

## Licencia

Este proyecto está bajo la licencia ISC.
