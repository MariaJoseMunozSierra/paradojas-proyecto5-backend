# ParadoX :
# Backend :
API REST de ParadoX, una red social donde los usuarios crean y debaten paradojas filosóficas.

## Enlaces :
- API desplegada: https://paradojas-backend.onrender.com
- Documentación (Swagger): https://paradojas-backend.onrender.com/api-docs
- Frontend desplegado: https://paradojas-frontend.vercel.app
- Repositorio del frontend: https://github.com/MariaJoseMunozSierra/paradojas-proyecto5

## Pruebas :
Administrador -> Usuario : esceptico_1 -> Contraseña : password123
Usuario normal -> Usuario : esceptico_2 -> Contraseña : password123

## Tecnologías :
- Node.js y Express
- MongoDB Atlas con Mongoose
- JWT para la autenticación
- bcryptjs para encriptar contraseñas
- express-validator para validar los datos
- Swagger para la documentación
- Desplegado en Render

## Estructura del proyecto :
- controllers : reciben la petición y responden
- services : lógica de negocio
- routes : definen las URLs
- models : esquemas de Mongoose
- middlewares : errores, validaciones, token y roles
- utils : funciones de ayuda
- seed : scripts con datos de prueba

## Cómo correrlo en tu computador :
1. Clona el repositorio
2. Instala las dependencias:
```
npm install
```
3. Crea un archivo `.env` en la raíz (usa `.env.example` como guía):
```
PORT=3000
MONGODB_URI=tu_connection_string_de_mongodb_atlas
JWT_SECRET=un_secreto_largo
JWT_EXPIRES_IN=7d
```
4. (Opcional) Llena la base de datos con datos de prueba. Este script borra los usuarios y paradojas que existan:
```
node seed/seedUsuariosParadojas.js
node seed/seedRespuestasVotosDuelos.js
```
5. Corre el servidor:
```
node app.js
```

## Autenticación y roles :
Después de iniciar sesión, la API entrega un token JWT. Las rutas protegidas lo piden en este header:

```
Authorization: Bearer TU_TOKEN
```

Hay dos roles: `user` y `admin`. Eliminar una paradoja solo lo puede hacer un `admin`.

## Endpoints principales
| Método |           Ruta            |              Descripción            |     Requiere      |
|--------|---------------------------|-------------------------------------|-------------------|
| POST   | /api/auth/registro        | Crear una cuenta                    | Nada              |
| POST   | /api/auth/login           | Iniciar sesión                      | Nada              |
| GET    | /api/paradojas            | Listar paradojas con su Chaos Index | Nada              |
| GET    | /api/paradojas/:id        | Ver una paradoja                    | Nada              |
| POST   | /api/paradojas            | Crear una paradoja                  | Token             |
| PUT    | /api/paradojas/:id        | Editar una paradoja                 | Token             |
| DELETE | /api/paradojas/:id        | Eliminar una paradoja               | Token y rol admin |
| POST   | /api/duelos               | Retar a otro usuario                | Token             |
| GET    | /api/duelos/mios          | Ver mis duelos                      | Token             |
| PATCH  | /api/duelos/:id/responder | Aceptar o rechazar un duelo         | Token             |
| PATCH  | /api/duelos/:id/finalizar | Finalizar un duelo                  | Token             |
| GET    | /api/ranking              | Ver el ranking de filósofos         | Nada              |

// También existen las rutas `/api/respuestas` (responder capas) y `/api/votos` (votar respuestas). Todos los endpoints con ejemplos están en `/api-docs` //

## Autores :
- María José Muñoz (@MariaJoseMunozSierra)
- Matías Gómez Gutiérrez (@mgomezg1042)