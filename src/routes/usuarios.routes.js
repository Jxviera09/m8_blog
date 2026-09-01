import express from "express";
import * as usuariosControllers from "../controllers/usuarios/index.js";
//import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getUsuarios);

//OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);

export default router;
