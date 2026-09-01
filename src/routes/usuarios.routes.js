import express from "express";
import * as usuariosControllers from "../controllers/usuarios/index.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//PERFIL DEL USUARIO AUTENTICADO (RUTA PROTEGIDA)
router.get("/perfil", verifyToken, usuariosControllers.getPerfil);

//OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getUsuarios);

//OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);

export default router;
