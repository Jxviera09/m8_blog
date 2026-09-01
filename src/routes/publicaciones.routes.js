import express from "express";
import * as publicacionesControllers from "../controllers/publicaciones/index.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

//OBTENER TODAS LAS PUBLICACIONES
router.get("/", publicacionesControllers.getPublicaciones);

//OBTENER ublicacionesControllerd POR ID
router.get("/:id", publicacionesControllers.getPublicacionById);

//CREAR PUBLICACIÓN
router.post("/", validateBody, publicacionesControllers.crearPublicacion);

export default router;
