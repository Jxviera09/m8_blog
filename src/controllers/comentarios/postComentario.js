import * as comentariosService from "../../services/comentarios.service.js";

const postComentario = async (req, res) => {
  try {
    // el autor sale del token, igual que en las publicaciones
    const usuarioId = req.usuario.id;
    const { publicacionId, contenido } = req.body;

    if (!publicacionId || !contenido) {
      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los siguientes campos: [publicacionId, contenido]",
        data: null,
      });
    }

    const comentario = await comentariosService.create({
      publicacionId,
      usuarioId,
      contenido,
    });

    if (!comentario) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ninguna publicación con id: " + publicacionId,
        data: null,
      });
    }

    res.status(201).json({
      status: "success",
      message: `Comentario creado con éxito con id: ${comentario.id}`,
      data: { comentario },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default postComentario;