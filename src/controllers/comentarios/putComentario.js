import Comentario from "../../models/Comentario.model.js";

const putComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ningún comentario con id: " + id,
        data: null,
      });
    }

    // 403 y no 404: el comentario existe, lo que falta es permiso sobre él
    if (comentario.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        status: "fail",
        message: "No tiene permiso para modificar un comentario de otro usuario.",
        data: null,
      });
    }

    // whitelist: contenido es lo único editable. El autor y la publicación no cambian
    if (contenido !== undefined) comentario.contenido = contenido;

    await comentario.save();

    res.status(200).json({
      status: "success",
      message: "Comentario actualizado con éxito.",
      data: { comentario },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default putComentario;