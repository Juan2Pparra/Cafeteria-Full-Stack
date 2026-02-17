# Cafeteria Full Stack (Proyecto en Desarrollo)

Aplicación full stack de e-commerce tipo cafetería desarrollada con **Node.js, Express, MongoDB y jQuery**.

El proyecto implementa autenticación con **JWT**, arquitectura **MVC**, gestión de productos, carrito de compras y consumo de API REST mediante **AJAX**.

---

## Funcionalidades

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Autenticación con JSON Web Token (JWT)
- Protección de rutas

### Productos
- Listado dinámico de productos
- Visualización desde el frontend mediante AJAX

### Carrito de Compras
- Agregar productos
- Eliminar productos
- Modificar cantidades (+ / -)

### Frontend
- Interfaz desarrollada con HTML5, CSS3 y jQuery
- Consumo de API REST con AJAX
- Diseño responsive (adaptable a móvil, tablet y escritorio)

---

## Tecnologías

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)

### Frontend
- HTML5
- CSS3 (Flexbox)
- jQuery
- AJAX

---
## servidor corre en:
http://localhost:3000

##Variables de entorno (.env)
PORT=3000
MONGO_URI=tu_conexion
JWT_SECRET=tu_clave_secreta

## 📡 Endpoints Principales
```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id

## Cómo ejecutar
npm install
npm run dev
--npx nodemon server.js




