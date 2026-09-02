import * as comentariosService from "../../services/comentarios.service.js";

const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await comentariosService.findById(id);

    if (!comentario) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ningún comentario con id: " + id,
        data: null,
      });
    }

    if (comentario.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        status: "fail",
        message: "No tiene permiso para eliminar un comentario de otro usuario.",
        data: null,
      });
    }

    await comentariosService.remove(comentario);

    res.status(200).json({
      status: "success",
      message: `Comentario con id ${id} eliminado con éxito.`,
      data: null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default deleteComentario;