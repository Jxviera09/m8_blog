# M8 – ABP: Implementación de API Backend Node Express

API RESTful construida con **Node.js + Express 5 + Sequelize + PostgreSQL** para
un blog con gestión de usuarios, publicaciones y comentarios, con autenticación
mediante **JSON Web Tokens** y subida de imágenes de perfil.

Corresponde a la **Parte 3 – Módulo 8** del proyecto ABP (Node & Express Web App).

---

## Requisitos previos

- Node.js **v18 o superior** (desarrollado y probado en v24)
- PostgreSQL v14 o superior
- npm

---

## Instalación

```bash
git clone https://github.com/Jxviera09/m8_blog.git
```

```bash
cd m8_blog
```

```bash
npm install
```

## Configuración

**1.** Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE m8_blog;
```

**2.** Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

**3.** Completa el `.env` con tus credenciales locales:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PG_URI` | Cadena de conexión completa a PostgreSQL | `postgres://postgres:tu_password@localhost:5432/m8_blog` |
| `SERVER_PORT` | Puerto del servidor Express | `3000` |
| `JWT_SECRET` | Clave con la que se firman los tokens | cadena aleatoria de 32+ caracteres |
| `JWT_EXPIRES_IN` | Tiempo de vida del token | `1h` |

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**4.** Crea las tablas ejecutando `data/tablas.sql` en pgAdmin o con `psql`.

## Ejecución

Modo desarrollo (recarga automática con `node --watch`):

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Al iniciar correctamente verás en consola:

```
Base de datos conectada...
Servidor activo....
```

> Los scripts usan `node --env-file=.env`, nativo desde Node 20, en lugar de la
> dependencia `dotenv`. Por el mismo criterio se usa `node --watch` en vez de
> `nodemon`: no agregar paquetes externos para algo que el runtime ya resuelve.
> **Importante:** por eso hay que levantar siempre con `npm run dev` o `npm start`.
> Ejecutar `node server.js` a secas no carga el `.env` y la app falla al arrancar
> con un mensaje indicando que falta `PG_URI`.

---

## Estructura del proyecto

```
m8_blog/
├── data/
│   ├── tablas.sql               # DDL de las tres tablas
│   └── postman_collection.json  # Colección de pruebas, incluye casos de error
├── logs/
│   └── access.log               # Registro de peticiones (no se versiona)
├── uploads/                     # Imágenes subidas (no se versionan)
├── src/
│   ├── config/
│   │   ├── database.js          # Instancia de Sequelize
│   │   └── multer.js            # Almacenamiento, filtro de tipo y límite de tamaño
│   ├── models/
│   │   ├── Usuario.model.js
│   │   ├── Publicacion.model.js
│   │   ├── Comentario.model.js
│   │   └── index.js             # Relaciones entre modelos
│   ├── services/                # Acceso a datos y reglas de negocio
│   │   ├── auth.service.js
│   │   ├── usuarios.service.js
│   │   ├── publicaciones.service.js
│   │   └── comentarios.service.js
│   ├── controllers/             # Manejo de req/res y códigos HTTP
│   │   ├── auth/
│   │   ├── usuarios/
│   │   ├── publicaciones/
│   │   └── comentarios/
│   ├── middlewares/
│   │   ├── validateBody.js      # Rechaza peticiones sin body
│   │   ├── verifyToken.js       # Valida el JWT y expone req.usuario
│   │   └── logger.js            # Escribe cada petición en logs/access.log
│   ├── utils/
│   │   └── utils.js             # Hash y comparación de contraseñas (bcrypt)
│   └── app.js                   # Configuración de Express
└── server.js                    # Punto de entrada
```

**Arquitectura en capas:** `ruta → middleware → controlador → servicio → modelo`.

---

## Modelo de datos

| Tabla | Campos |
|---|---|
| `usuarios` | id, nombre, email, password, avatar, admin, status, fecha_creacion, fecha_actualizacion |
| `publicaciones` | id, usuario_id, titulo, contenido, fecha_creacion, fecha_actualizacion |
| `comentarios` | id, publicacion_id, usuario_id, contenido, fecha_creacion, fecha_actualizacion |

### Relaciones

| Relación | Tipo | Implementación |
|---|---|---|
| `Usuario` → `Publicacion` | **1:N** | `Usuario.hasMany(Publicacion)` con `onDelete: CASCADE` |
| `Usuario` → `Comentario` | **1:N** | `Usuario.hasMany(Comentario)` con `onDelete: CASCADE` |
| `Publicacion` → `Comentario` | **1:N** | `Publicacion.hasMany(Comentario)` con `onDelete: CASCADE` |

El `CASCADE` es una decisión de negocio: un comentario no tiene sentido sin la
publicación que comenta, y las publicaciones de un usuario eliminado tampoco.
Al borrar una publicación, sus comentarios desaparecen en la misma operación,
sin dejar registros huérfanos apuntando a una fila que ya no existe.

Las relaciones 1:1 y N:M del proyecto integrador se implementaron en la Parte 2
(Módulo 7), donde el dominio —usuarios, perfiles, productos y ventas— las
requería. Este blog no tiene ninguna entidad que las justifique, y forzarlas
habría agregado complejidad sin resolver un problema real.

---

## Autenticación

La API usa **JWT**. El flujo es: registrarse, iniciar sesión para obtener un
token, y enviarlo en cada petición a una ruta protegida.

### 1. Registrarse

```
POST /auth/registro
Content-Type: application/json

{
  "nombre": "Rodrigo",
  "email": "rodrigo@gmail.com",
  "password": "987654321"
}
```

La contraseña **nunca** se guarda en texto plano: se hashea con **bcrypt**
(12 rondas de salt) antes de insertarla, y se excluye de todas las respuestas
de la API.

### 2. Iniciar sesión

```
POST /auth/login
Content-Type: application/json

{
  "email": "rodrigo@gmail.com",
  "password": "987654321"
}
```

Respuesta:

```json
{
  "status": "success",
  "message": "Usuario autenticado con éxito.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": { "id": 4, "nombre": "Rodrigo", "email": "rodrigo@gmail.com" }
  }
}
```

### 3. Usar el token

Envía el token en la cabecera `Authorization`, con el prefijo `Bearer`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

En Postman: pestaña *Authorization* → tipo **Bearer Token**.

### Respuestas del middleware de autenticación

| Situación | Código | Mensaje |
|---|---|---|
| Sin cabecera `Authorization` | `401` | Token no proporcionado. Use el header: Authorization: Bearer &lt;token&gt; |
| Token manipulado o firmado con otra clave | `401` | Token inválido o alterado. |
| Token vencido | `401` | El token expiró. Vuelva a autenticarse en POST /auth/login. |
| Token válido pero no es dueño del recurso | `403` | No tiene permiso para modificar/eliminar … de otro usuario. |

Expirado e inválido se distinguen a propósito: son problemas distintos para
quien consume la API. Ante un token vencido el cliente solo debe volver a hacer
login; ante uno inválido, algo más grave está pasando.

---

## Endpoints

Todas las respuestas usan el mismo formato:

```json
{
  "status": "success | fail | error",
  "message": "Descripción legible",
  "data": {}
}
```

`success` = la operación salió bien · `fail` = el cliente se equivocó (4xx) ·
`error` = falló el servidor (5xx). La llave `data` siempre está presente, aunque
valga `null`.

🔓 = pública · 🔒 = requiere token

### Autenticación

| | Método | Ruta | Descripción |
|---|---|---|---|
| 🔓 | POST | `/auth/registro` | Crea un usuario. Body: `nombre`, `email`, `password` |
| 🔓 | POST | `/auth/login` | Devuelve el JWT. Body: `email`, `password` |

### Usuarios

| | Método | Ruta | Descripción |
|---|---|---|---|
| 🔓 | GET | `/api/usuarios` | Lista usuarios. Query: `offset`, `limit`, `sortBy`, `direction` |
| 🔒 | GET | `/api/usuarios/perfil` | Datos del usuario autenticado (según el token) |
| 🔓 | GET | `/api/usuarios/:id` | Usuario por id |
| 🔒 | POST | `/api/usuarios/avatar` | Sube la foto de perfil. `multipart/form-data`, campo `avatar` |

`sortBy` acepta `id`, `nombre` o `email`; `direction` acepta `asc` o `desc`.
Cualquier otro valor se ignora en vez de provocar un error.

### Publicaciones

| | Método | Ruta | Descripción |
|---|---|---|---|
| 🔓 | GET | `/api/publicaciones` | Lista con su autor. Query: `search`, `usuarioId`, `limit`, `offset` |
| 🔓 | GET | `/api/publicaciones/:id` | Publicación por id |
| 🔒 | POST | `/api/publicaciones` | Crea. Body: `titulo`, `contenido` |
| 🔒 | PUT | `/api/publicaciones/:id` | Actualiza. **Solo el autor** |
| 🔒 | DELETE | `/api/publicaciones/:id` | Elimina. **Solo el autor** |

`search` filtra por título sin distinguir mayúsculas (`ILIKE`), así que
`?search=primera` y `?search=PRIMERA` devuelven lo mismo.

### Comentarios

| | Método | Ruta | Descripción |
|---|---|---|---|
| 🔓 | GET | `/api/comentarios` | Lista con su autor. Query: `publicacionId`, `limit`, `offset` |
| 🔒 | POST | `/api/comentarios` | Crea. Body: `publicacionId`, `contenido` |
| 🔒 | PUT | `/api/comentarios/:id` | Actualiza. **Solo el autor** |
| 🔒 | DELETE | `/api/comentarios/:id` | Elimina. **Solo el autor** |

### Archivos estáticos

| | Método | Ruta | Descripción |
|---|---|---|---|
| 🔓 | GET | `/uploads/:archivo` | Sirve las imágenes subidas |

### Códigos de estado

| Código | Cuándo |
|---|---|
| `200` | Consulta, actualización o borrado con éxito |
| `201` | Recurso creado |
| `400` | Faltan campos, email duplicado, o archivo rechazado por tipo/tamaño |
| `401` | Falta el token, es inválido, expiró, o las credenciales son incorrectas |
| `403` | Token válido, pero el recurso pertenece a otro usuario |
| `404` | El recurso no existe |
| `500` | Error no previsto del servidor |

---

## Carga de archivos

`POST /api/usuarios/avatar` recibe un `multipart/form-data` con el campo
**`avatar`** y guarda la imagen en `uploads/`, registrando su ruta en la columna
`avatar` del usuario autenticado.

| Regla | Valor |
|---|---|
| Extensiones aceptadas | `.jpg`, `.jpeg`, `.png`, `.webp` |
| Tipos MIME aceptados | `image/jpeg`, `image/png`, `image/webp` |
| Tamaño máximo | 2 MB |
| Nombre en disco | UUID aleatorio + extensión original |

Respuesta exitosa:

```json
{
  "status": "success",
  "message": "Avatar actualizado con éxito.",
  "data": {
    "id": 4,
    "nombre": "Rodrigo",
    "avatar": "/uploads/929a93af-1ca9-4158-b795-71715371c94c.png",
    "archivo": {
      "nombreOriginal": "foto.png",
      "tipo": "image/png",
      "tamanoBytes": 248099
    }
  }
}
```

La imagen queda accesible en `http://localhost:3000/uploads/<nombre>.png`.

El archivo **se renombra a un UUID** en lugar de conservar el nombre original.
Son dos problemas los que evita: que dos usuarios que suban `foto.jpg` se pisen
el archivo, y que alguien envíe un nombre como `../../server.js` para escribir
fuera de la carpeta de destino.

---

## Justificación de decisiones técnicas

### ¿Cómo se separaron rutas, controladores y servicios?

Cada capa tiene una responsabilidad y desconoce las de arriba:

| Capa | Se encarga de | No conoce |
|---|---|---|
| Ruta | Qué método y qué middlewares se aplican | La lógica |
| Middleware | Autenticación, validación previa, logging | El recurso concreto |
| Controlador | Leer `req`, elegir el código HTTP, armar el JSON | Sequelize |
| Servicio | Consultas, transacciones, reglas de negocio | `req`, `res`, códigos HTTP |
| Modelo | Estructura de la tabla y validaciones de campo | Todo lo anterior |

El corte se puede verificar mirando los imports: **ningún controlador importa un
modelo, ni Sequelize, ni `jsonwebtoken`, ni `bcrypt`** — solo su servicio.

En la práctica esto significa que un controlador no sabe si por debajo hay una
transacción. `POST /api/publicaciones` llama a `publicacionesService.create()`;
si el servicio devuelve `null` porque el usuario no existe, el controlador
responde `404`. La transacción con su `rollback` vive completa dentro del
servicio.

La única regla que se dejó en el controlador es la comparación de propiedad
(`publicacion.usuarioId !== req.usuario.id`), porque depende de `req.usuario` y
el servicio no debe conocer el request.

Los archivos se dividieron **uno por operación** (`getPublicaciones.js`,
`postPublicacion.js`, `putPublicacion.js`…) en vez de un único
`publicaciones.controller.js`. Con archivos chicos es más fácil ubicar qué
cambiar, y los conflictos al trabajar en paralelo se reducen.

### ¿Qué validaciones se realizaron antes de insertar o modificar datos?

Cuatro capas independientes:

1. **Middleware `validateBody`**: rechaza peticiones sin body con un `400`.
2. **Controlador**: verifica que estén los campos obligatorios antes de tocar la
   base, y que el recurso exista antes de actualizarlo o eliminarlo, devolviendo
   `404` en vez de fallar con un `500`.
3. **Servicio**: aplica una *whitelist* de campos editables.
4. **Modelo**: validaciones de Sequelize (`allowNull`, `unique`, `isEmail`,
   `notEmpty`) con mensajes en español.

La **whitelist** del punto 3 es la más importante. En `PUT /api/publicaciones/:id`
no se pasa `req.body` completo al modelo: el servicio define
`CAMPOS_EDITABLES = ["titulo", "contenido"]` y descarta el resto. Sin eso, un
cliente podría enviar `{"usuarioId": 1}` en el body y transferirle su publicación
a otra persona. Es el mismo problema de *mass assignment* que se documentó en la
Parte 2.

En la subida de archivos se valida **extensión y tipo MIME**, no solo el MIME.
El `Content-Type` de un archivo lo declara el cliente, así que un cliente
descuidado envía `application/octet-stream` y uno malicioso puede mentir. Por eso
la extensión es obligatoria: un archivo cuya extensión no está en la lista se
rechaza siempre, sin importar qué diga la cabecera.

### ¿Por qué se protegieron esas rutas y no otras?

El criterio fue: **lectura pública, escritura autenticada, modificación
restringida al dueño**.

Un blog se lee sin cuenta, así que todos los `GET` de publicaciones, comentarios
y usuarios quedaron abiertos. Escribir sí exige identidad, porque cada
publicación y cada comentario tienen un autor que queda registrado.

El caso que motivó la decisión es concreto. Antes de proteger la ruta,
`POST /api/publicaciones` leía el `usuarioId` del body:

```js
let { usuarioId, titulo, contenido } = req.body;
```

Cualquiera podía enviar `{"usuarioId": 3}` y publicar a nombre de otra persona.
Ahora el autor sale del token, que el cliente no puede falsificar:

```js
const usuarioId = req.usuario.id;
```

Se comprobó enviando `{"usuarioId": 1, ...}` con el token del usuario 4: la
publicación se guardó con `usuario_id = 4`. El dato del body se ignora.

Sobre esto se agregó un segundo nivel: tener token no basta para editar
**cualquier** recurso. `PUT` y `DELETE` comparan el autor del registro con el
usuario del token y responden `403` si no coinciden. Se eligió `403` y no `404`
porque son cosas distintas: `404` es "esto no existe", `403` es "existe, pero no
es tuyo".

`GET /api/usuarios/perfil` está protegida por un motivo adicional: el id no
viaja en la URL, se toma del token. Así ningún usuario puede pedir el perfil de
otro cambiando un número en la dirección.

### ¿Dónde y cómo se almacena el token?

**La API no lo almacena.** JWT es *stateless*: el servidor firma el token con
`JWT_SECRET`, y en cada petición lo verifica recalculando la firma. No hay tabla
de sesiones ni nada guardado del lado del servidor, lo que permite escalar a
varias instancias sin compartir estado.

El token lo guarda **el cliente**, y ahí la recomendación depende del tipo:

| Cliente | Dónde | Por qué |
|---|---|---|
| Frontend web | Cookie `httpOnly` + `Secure` | El JavaScript de la página no puede leerla, lo que limita el robo por XSS |
| App móvil | Almacenamiento seguro del sistema | Cifrado por el sistema operativo |
| Postman | Variable de colección | Se refresca sola con un script tras cada login |

`localStorage` es la opción más común y la más frágil: cualquier script inyectado
en la página puede leerlo. Se menciona explícitamente porque es la que suele
elegirse por defecto.

Lo que **sí** está resuelto del lado del servidor es la vida útil: el token
expira según `JWT_EXPIRES_IN` (1 hora por defecto), y `verifyToken` distingue un
token vencido de uno alterado. La expiración corta limita el daño si un token se
filtra.

### ¿Por qué el registro de peticiones se escribe en un archivo plano?

`src/middlewares/logger.js` escribe cada petición en `logs/access.log`:

```
2026-09-02T01:44:17.946Z | GET /api/usuarios/perfil | 401 | anonimo
2026-09-02T01:44:18.123Z | GET /api/usuarios/perfil | 200 | usuario:4
```

Dos decisiones de implementación:

- Se registra en `res.on("finish")` y no al entrar, porque solo al terminar la
  respuesta se conoce el **código de estado**. Loguear antes obligaría a anotar
  la petición sin saber si terminó en `200` o en `401`.
- Se usa `fs.appendFile` (asíncrono) y no `appendFileSync`: la respuesta ya se
  envió, así que no tiene sentido bloquear el hilo esperando al disco.

El archivo sirve además como evidencia de que la protección funciona: la misma
ruta aparece como `401 | anonimo` y como `200 | usuario:4`.

### ¿Cómo se protegen los datos sensibles?

- Las credenciales viven en `.env`, cargado con `--env-file`, y nunca están
  escritas en el código. El `.env` está en `.gitignore`; se publica solo
  `.env.example` con las claves vacías.
- Las contraseñas se guardan hasheadas con **bcrypt** (12 rondas). El hash es de
  una sola vía: ni siquiera desde la base de datos se puede recuperar la
  contraseña original.
- El campo `password` se excluye de todas las respuestas: los servicios definen
  explícitamente qué columnas devuelven (`CAMPOS_PUBLICOS`), en lugar de
  devolver el registro completo.
- El login responde **el mismo mensaje** si el email no existe o si la contraseña
  es incorrecta. Diferenciarlos permitiría averiguar qué correos están
  registrados probando direcciones una por una.

---

## Pruebas

La colección `data/postman_collection.json` contiene los requests organizados en
carpetas (`AUTH`, `USUARIOS`, `PUBLICACIONES`, `COMENTARIOS`, `UPLOAD`),
incluyendo los casos de error:

| Caso | Esperado |
|---|---|
| Login con credenciales incorrectas | `401` |
| Login con email inexistente | `401` (mismo mensaje que el anterior) |
| Registro con email duplicado | `400` |
| Crear publicación sin token | `401` |
| Petición con token alterado | `401` |
| Petición con token expirado | `401`, con mensaje distinto al anterior |
| Editar una publicación ajena | `403` |
| Consultar un id inexistente | `404` |
| Subir un PDF como avatar | `400` |
| Subir una imagen de más de 2 MB | `400` |

Para reproducir el caso del token expirado, poner `JWT_EXPIRES_IN=10s` en el
`.env`, reiniciar el servidor, hacer login y esperar 15 segundos antes de usar
el token.

---

## Reflexión: integración de los tres módulos

Cada módulo fue la base para el siguiente proyecto. Juntando, revisando y
estructurando cada uno de ellos, logré crear el proyecto final del Módulo 8.

En el **Módulo 6**, logré crear la base del servidor utilizando Express, rutas,
middlewares y la persistencia de archivos planos. Como trabajamos con datos en
formato JSON, funcionaba bien para pocos registros, pero no nos permitía
relacionar entidades ni consultar con filtros. Para tener un mayor orden, aprendí
a separar las rutas de los controladores, una estructura que mantuve en adelante.
Además, la persistencia en archivos planos regresó en el proyecto final, pero
esta vez redirigida a un historial de actividad guardado en `logs/access.log`.

En el **Módulo 7**, en vez del formato JSON, trabajamos con PostgreSQL y
Sequelize, ya que así podíamos crear relaciones entre entidades, validaciones
centralizadas en el modelo, consultas filtradas y transacciones. Aquí también
incorporé la capa de servicios, que me sirvió para separar la lógica del negocio
de los controladores, y la *whitelist* de campos editables, un filtro directo en
el código para asegurar que el usuario solo pueda modificar los datos permitidos,
protegiendo las columnas sensibles de la base de datos.

En el **Módulo 8**, el enfoque principal cambió hacia la seguridad y la
desconfianza del cliente. Al implementar JWT (JSON Web Tokens) para la
autenticación, aprendí que el servidor nunca debe confiar a ciegas en lo que
viene en el cuerpo de la petición (`req.body`). Decisiones como extraer el ID del
autor directamente del token y no del body, diferenciar los errores `403`
(prohibido) de los `404` (no encontrado), validar las extensiones de archivos
subidos y renombrarlos de forma aleatoria, responden a lo mismo: el cliente puede
manipular los datos, por lo que el servidor es el único lugar donde las reglas se
deben hacer cumplir de verdad.

### Iteraciones sobre entregas anteriores

El historial de commits documenta el avance por etapas. Los ajustes hechos sobre
lo que ya existía:

| Cambio | Motivo |
|---|---|
| Credenciales movidas al `.env` | Estaban escritas en `database.js` y llegaron a un repositorio público |
| Contraseñas hasheadas con bcrypt | Antes se guardaban tal como llegaban |
| `usuarioId` tomado del token y no del body | Permitía publicar suplantando a otro usuario |
| Formato unificado `{status, message, data}` | Cada endpoint devolvía llaves distintas (`usuarios`, `publicaciones`, `usuario`) |
| `GET /api/usuarios/:id` devuelve `404` | Respondía `200` con `usuario: null`, lo que rompe a cualquier cliente |
| Capa de servicios extraída | Los controladores mezclaban HTTP con consultas a la base |
| Errores de multer traducidos a `400` | Un archivo demasiado grande devolvía un `500` sin explicación |

---

## Autora

Javiera Saavedra — [@Jxviera09](https://github.com/Jxviera09)
Desarrollo de Aplicaciones Full Stack JavaScript Trainee — Módulo 8