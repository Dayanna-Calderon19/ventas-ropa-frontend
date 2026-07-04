# Sistema de Gestión de Ventas - Frontend

Este es el frontend del Sistema de Gestión de Ventas de Ropa, construido utilizando React 19, Vite 8 y estilizado con la especificación de Tailwind CSS v4. Se comunica con el backend mediante peticiones HTTP asíncronas con Axios y está listo para ser desplegado en Vercel.

---

## Tecnologías y Herramientas

*   Librería Principal: React 19
*   Herramienta de Construcción: Vite 8
*   Estilos (CSS): Tailwind CSS v4
*   Peticiones HTTP: Axios
*   Iconos: React Icons
*   Enrutamiento: React Router DOM v7

---

## Estructura del Directorio

```text
tienda-frontend/
├── public/                 # Archivos públicos y assets estáticos (logos, favicons)
├── src/
│   ├── components/         # Componentes reutilizables de UI (botones, tablas, inputs)
│   ├── pages/              # Páginas completas (Login, Dashboard, Ventas, Inventario, etc.)
│   ├── routes/             # Configuración del Router principal
│   ├── services/           # Clientes HTTP y llamadas a la API del Backend (Axios)
│   ├── index.css           # Punto de entrada de CSS e importación de Tailwind v4
│   ├── App.jsx             # Componente raíz de React
│   └── main.jsx            # Punto de entrada de renderizado de React
├── vercel.json             # Configuración de redirecciones para SPA en Vercel
├── tailwind.config.js      # Configuración de temas/colores en Tailwind
├── vite.config.js          # Configuración de compilación de Vite
├── package.json
└── eslint.config.js        # Configuración de calidad de código y linter
```

---

## Configuración del Entorno (.env)

Crea un archivo .env en la raíz de tienda-frontend/ para indicarle a Vite la API de backend:

```env
VITE_API_URL="http://localhost:4000/api/v1"
```

---

## Comandos del Proyecto

Instala las dependencias necesarias antes de iniciar la aplicación:

```bash
npm install
```

### Comandos Disponibles
*   Arrancar servidor de desarrollo local:
    ```bash
    npm run dev
    ```
*   Compilar el proyecto para producción:
    ```bash
    npm run build
    ```
*   Analizar el código con Linter:
    ```bash
    npm run lint
    ```
*   Previsualizar la compilación de producción localmente:
    ```bash
    npm run preview
    ```

---

## Despliegue en Vercel

Este proyecto está configurado mediante vercel.json para evitar que el recargar de página arroje errores 404 al usar React Router.

1.  Conecta tu repositorio en Vercel y añade un nuevo proyecto.
2.  Establece la Root Directory a tienda-frontend.
3.  Define las siguientes opciones:
    *   Framework Preset: Vite
    *   Build Command: npm run build
    *   Output Directory: dist
4.  Configura las variables de entorno en Vercel, en especial VITE_API_URL apuntando a tu servidor de producción de backend.
5.  Despliega la aplicación.
