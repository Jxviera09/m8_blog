import express from "express";
import * as comentariosControllers from "../controllers/comentarios.controller.js";

const router = express.Router();

// RUTA CREAR UN COMENTARIO
router.post("/", comentariosControllers.crearComentario);

export default router;
