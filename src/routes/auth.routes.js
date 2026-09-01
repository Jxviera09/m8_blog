import express from "express";
import * as authControllers from "../controllers/auth/index.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//REGISTRAR NUEVOS USUARIOS
router.post("/registro", validateBody, authControllers.registroUsuario);

//AUTENTICAR USUARIOS
router.post("/login", validateBody, authControllers.login);

export default router;
