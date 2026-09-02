import express from "express";
import * as comentariosControllers from "../controllers/comentarios/index.js";
import validateBody from "../middlewares/validateBody.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//OBTENER COMENTARIOS (opcionalmente filtrados por ?publicacionId=)
router.get("/", comentariosControllers.getComentario);

//CREAR COMENTARIO (RUTA PROTEGIDA)
router.post("/", verifyToken, validateBody, comentariosControllers.postComentario);

//ACTUALIZAR COMENTARIO (RUTA PROTEGIDA)
router.put("/:id", verifyToken, validateBody, comentariosControllers.putComentario);

//ELIMINAR COMENTARIO (RUTA PROTEGIDA)
router.delete("/:id", verifyToken, comentariosControllers.deleteComentario);

export default router;