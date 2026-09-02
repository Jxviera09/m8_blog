import express from "express";
import * as publicacionesControllers from "../controllers/publicaciones/index.js";
import validateBody from "../middlewares/validateBody.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//OBTENER TODAS LAS PUBLICACIONES
router.get("/", publicacionesControllers.getPublicaciones);

//OBTENER PUBLICACIÓN POR ID
router.get("/:id", publicacionesControllers.getPublicacionById);

//CREAR PUBLICACIÓN (RUTA PROTEGIDA)
router.post("/", verifyToken, validateBody, publicacionesControllers.crearPublicacion);

//ACTUALIZAR PUBLICACIÓN (RUTA PROTEGIDA)
router.put("/:id", verifyToken, validateBody, publicacionesControllers.putPublicacion);

//ELIMINAR PUBLICACIÓN (RUTA PROTEGIDA)
router.delete("/:id", verifyToken, publicacionesControllers.deletePublicacion);

export default router;