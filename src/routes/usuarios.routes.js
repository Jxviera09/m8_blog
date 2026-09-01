import express from "express";
import * as usuariosControllers from "../controllers/usuarios/index.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../config/multer.js";

const router = express.Router();

//PERFIL DEL USUARIO AUTENTICADO (RUTA PROTEGIDA)
router.get("/perfil", verifyToken, usuariosControllers.getPerfil);

//OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getUsuarios);

//SUBIR AVATAR DEL USUARIO AUTENTICADO (RUTA PROTEGIDA)
router.post("/avatar", verifyToken, upload.single("avatar"), usuariosControllers.subirAvatar);

//OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);

export default router;
