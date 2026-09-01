import express from "express";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import publicacionesRoutes from "./routes/publicaciones.routes.js";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS DE VISTAS

//RUTAS DE AUTENTICACIÓN (registro de usuarios / login)
app.use("/auth", authRoutes);

//RUTAS DE LA API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/publicaciones", publicacionesRoutes);

export default app;
