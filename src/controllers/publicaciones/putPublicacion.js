import Publicacion from "../../models/Publicacion.model.js";

const putPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;

    const publicacion = await Publicacion.findByPk(id);

    if (!publicacion) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ninguna publicación con id: " + id,
        data: null,
      });
    }

    // 403 y no 404: la publicación existe, lo que falta es permiso sobre ella
    if (publicacion.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        status: "fail",
        message: "No tiene permiso para modificar una publicación de otro usuario.",
        data: null,
      });
    }

    // whitelist: solo estos campos son editables, aunque el body traiga más
    if (titulo !== undefined) publicacion.titulo = titulo;
    if (contenido !== undefined) publicacion.contenido = contenido;

    await publicacion.save();

    res.status(200).json({
      status: "success",
      message: "Publicación actualizada con éxito.",
      data: { publicacion },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default putPublicacion;