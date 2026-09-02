import express from "express";
import logger from "./middlewares/logger.js";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import publicacionesRoutes from "./routes/publicaciones.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import multer from "multer";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//REGISTRO DE PETICIONES EN ARCHIVO PLANO
app.use(logger);

//SERVIR ARCHIVOS ESTÁTICOS
app.use("/uploads", express.static("uploads"));

//RUTAS DE VISTAS

//RUTAS DE AUTENTICACIÓN (registro de usuarios / login)
app.use("/auth", authRoutes);

//RUTAS DE LA API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);

//MANEJO CENTRALIZADO DE ERRORES
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "El archivo supera el tamaño máximo permitido (2 MB)."
          : `Error al subir el archivo: ${err.message}`,
      data: null,
    });
  }

  return res
    .status(400)
    .json({ status: "fail", message: err.message, data: null });
});

export default app;
