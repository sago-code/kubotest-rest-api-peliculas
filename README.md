# Prueba Tecnica Kubo - API REST de Películas

## Descripción
Esta es una API REST desarrollada con TypeScript y Express para gestionar una base de datos de películas.

## Estructura del Proyecto 
```
src/
├── app.ts # Configuración principal de la aplicación
├── init.ts # Inicialización de la aplicación
├── index.ts # Punto de entrada
├── controllers/ # Controladores de la aplicación
├── database/ # Configuración de la base de datos
├── entities/ # Modelos/Entidades
├── middleware/ # Middlewares personalizados
├── migrations/ # Migraciones de la base de datos
├── routes/ # Definición de rutas
├── services/ # Lógica de negocio
└── types/ # Definiciones de tipos TypeScript
```

## Tecnologías Utilizadas
- TypeScript
- Express.js
- TypeORM (inferido por la estructura)
- Node.js

## Características
- Arquitectura en capas (Controllers, Services, Entities)
- Sistema de migración de base de datos
- Manejo de tipos estático con TypeScript
- Middleware personalizado para seguridad y validación
- Rutas modularizadas

## Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migrations:run

## Ejecución con Docker

### Prerrequisitos
- Docker instalado en tu sistema
- Base de datos MySQL (debe estar configurada externamente)

### Construcción y ejecución con Docker

1. **Construir la imagen**
```bash
docker build -t kubotest-movies-api .
```

2. **Ejecutar el contenedor**
```bash
docker run -p 3000:3000 kubotest-movies-api
```
### Notas sobre Docker
- La imagen solo contiene el entorno de Node.js (v22.14.0-alpine)
- La base de datos MySQL debe configurarse por separado, el script sql/xampp esta en la carpeta database
- El puerto expuesto es el 3000
- Asegúrate de tener las variables de entorno configuradas para la conexión a la base de datos

### Estructura de Archivos Docker
´´´
├── Dockerfile # Configuración básica de Node.js
└── .dockerignore # Archivos ignorados en el build
```

# Iniciar el servidor en modo desarrollo

```
npm run dev
```
## Uso de la API

### Endpoints Disponibles
Para obtener una lista detallada de los endpoints disponibles, se recomienda revisar el directorio `routes/`.


### Autenticación
La API probablemente utiliza middleware de autenticación para proteger las rutas sensibles. El token que se genera funciona hasta que el usuario se cierre sesion.

## Scripts Disponibles

```json
{
  "dev": "Inicia el servidor en modo desarrollo",
  "build": "Compila el proyecto TypeScript",
  "start": "Inicia el servidor en modo producción",
  "migrations:run": "Ejecuta las migraciones pendientes",
  "migrations:generate": "Genera nuevas migraciones"
}
```

## Desarrollo

## Estructura de Código

### Controllers
Los controladores manejan las solicitudes HTTP y delegan la lógica de negocio a los servicios.

### Services
Contienen la lógica de negocio principal y se comunican con las entidades/modelos.

### Entities
Definen la estructura de los datos y las relaciones de la base de datos.

### Middleware
Contiene funciones intermedias para procesamiento de solicitudes, como:
- Validación
- Autenticación
- Manejo de errores

### Routes
Define las rutas de la API y conecta los endpoints con los controladores correspondientes.

## autor: Santiago Orjuela Vera.
        Tecnico en programacion de software
        Estudiante de Ingenieria de sistemas